import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  IDataObject,
} from 'n8n-workflow';

import { sessionOperations, sessionFields } from './descriptions/SessionDescription';
import { messageOperations, messageFields } from './descriptions/MessageDescription';
import { groupOperations, groupFields } from './descriptions/GroupDescription';
import { contactOperations, contactFields } from './descriptions/ContactDescription';
import { mediaOperations, mediaFields } from './descriptions/MediaDescription';
import { webhookOperations, webhookFields } from './descriptions/WebhookDescription';
import { chatOperations, chatFields } from './descriptions/ChatDescription';
import { statusOperations, statusFields } from './descriptions/StatusDescription';
import { quePasaApiRequest, formatPhoneNumber } from '../../utils/GenericFunctions';

export class QuePasa implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'QuePasa API (WhatsApp)',
    name: 'quePasa',
    icon: 'file:quepasa.png',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with QuePasa WhatsApp API',
    defaults: {
      name: 'QuePasa API (WhatsApp)',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'quePasaApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Chat',
            value: 'chat',
          },
          {
            name: 'Contact',
            value: 'contact',
          },
          {
            name: 'Group',
            value: 'group',
          },
          {
            name: 'Media',
            value: 'media',
          },
          {
            name: 'Message',
            value: 'message',
          },
          {
            name: 'Session',
            value: 'session',
          },
          {
            name: 'Status',
            value: 'status',
          },
          {
            name: 'Webhook',
            value: 'webhook',
          },
        ],
        default: 'session',
      },
      ...sessionOperations,
      ...sessionFields,
      ...messageOperations,
      ...messageFields,
      ...groupOperations,
      ...groupFields,
      ...contactOperations,
      ...contactFields,
      ...mediaOperations,
      ...mediaFields,
      ...webhookOperations,
      ...webhookFields,
      ...chatOperations,
      ...chatFields,
      ...statusOperations,
      ...statusFields,
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    const resource = this.getNodeParameter('resource', 0) as string;
    const operation = this.getNodeParameter('operation', 0) as string;

    for (let i = 0; i < items.length; i++) {
      try {
        let responseData: IDataObject | IDataObject[] = {};

        // ============================================
        //              SESSION
        // ============================================
        if (resource === 'session') {
          if (operation === 'getQrCode') {
            const userId = this.getNodeParameter('userId', i) as string;
            const token = this.getNodeParameter('token', i, '') as string;
            const returnAsImage = this.getNodeParameter('returnAsImage', i, true) as boolean;

            responseData = await quePasaApiRequest.call(
              this,
              'POST',
              '/scan',
              {},
              {},
              {
                headers: {
                  'X-QUEPASA-USER': userId,
                  'X-QUEPASA-TOKEN': token,
                },
              }
            );

            const executionData: INodeExecutionData = {
              json: responseData as IDataObject,
            };

            if (returnAsImage && (responseData as IDataObject).qrcode) {
              const base64Data = ((responseData as IDataObject).qrcode as string).replace(/^data:image\/png;base64,/, '');
              executionData.binary = {
                qrcode: await this.helpers.prepareBinaryData(
                  Buffer.from(base64Data, 'base64'),
                  'qrcode.png',
                  'image/png'
                ),
              };
            }

            returnData.push(executionData);
            continue;
          } else if (operation === 'checkStatus') {
            responseData = await quePasaApiRequest.call(this, 'GET', '/info');
          } else if (operation === 'getInfo') {
            responseData = await quePasaApiRequest.call(this, 'GET', '/info');
          } else if (operation === 'disconnect') {
            const confirmation = this.getNodeParameter('confirmation', i) as boolean;
            if (!confirmation) {
              throw new NodeOperationError(
                this.getNode(),
                'You must confirm disconnection',
                { itemIndex: i }
              );
            }
            responseData = await quePasaApiRequest.call(this, 'POST', '/logout');
          }
        }

        // ============================================
        //              MESSAGE
        // ============================================
        else if (resource === 'message') {
          if (operation === 'sendText') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const text = this.getNodeParameter('text', i) as string;
            const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

            const body: IDataObject = {
              chatId: formatPhoneNumber(chatId),
              text,
            };

            if (additionalOptions.trackId) {
              body.trackId = additionalOptions.trackId;
            }

            responseData = await quePasaApiRequest.call(this, 'POST', '/send', body);
          } else if (operation === 'sendMedia') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const mediaType = this.getNodeParameter('mediaType', i) as string;
            const binaryProperty = this.getNodeParameter('binaryProperty', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;

            const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
            const base64Data = buffer.toString('base64');

            const body: IDataObject = {
              chatId: formatPhoneNumber(chatId),
              [mediaType]: `data:${binaryData.mimeType};base64,${base64Data}`,
            };

            if (caption) {
              body.caption = caption;
            }

            responseData = await quePasaApiRequest.call(this, 'POST', '/send', body);
          } else if (operation === 'sendFromUrl') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const url = this.getNodeParameter('url', i) as string;
            const caption = this.getNodeParameter('caption', i, '') as string;
            const filename = this.getNodeParameter('filename', i, '') as string;

            const body: IDataObject = {
              chatId: formatPhoneNumber(chatId),
              url,
            };

            if (caption) {
              body.caption = caption;
            }
            if (filename) {
              body.filename = filename;
            }

            responseData = await quePasaApiRequest.call(this, 'POST', '/send', body);
          } else if (operation === 'revokeMessage') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'DELETE', `/messages/${messageId}`);
          } else if (operation === 'reactToMessage') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            const emoji = this.getNodeParameter('emoji', i) as string;

            const body: IDataObject = {
              emoji,
            };

            responseData = await quePasaApiRequest.call(this, 'POST', `/messages/${messageId}/react`, body);
          } else if (operation === 'forwardMessage') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            const toChatId = this.getNodeParameter('toChatId', i) as string;

            const body: IDataObject = {
              to: formatPhoneNumber(toChatId),
            };

            responseData = await quePasaApiRequest.call(this, 'POST', `/messages/${messageId}/forward`, body);
          } else if (operation === 'getHistory') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const limit = this.getNodeParameter('limit', i, 50) as number;

            responseData = await quePasaApiRequest.call(
              this,
              'GET',
              `/chats/${formatPhoneNumber(chatId)}/messages`,
              {},
              { limit: Math.min(limit, 100) }
            );
          }
        }

        // ============================================
        //              GROUP
        // ============================================
        else if (resource === 'group') {
          if (operation === 'listGroups') {
            responseData = await quePasaApiRequest.call(this, 'GET', '/groups');
          } else if (operation === 'getGroupInfo') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'GET', `/groups/${groupId}`);
          } else if (operation === 'createGroup') {
            const name = this.getNodeParameter('name', i) as string;
            const participantsStr = this.getNodeParameter('participants', i) as string;
            const topic = this.getNodeParameter('topic', i, '') as string;

            const participants = participantsStr
              .split(',')
              .map(p => formatPhoneNumber(p.trim()))
              .filter(p => p);

            const body: IDataObject = {
              title: name,
              participants,
            };

            if (topic) {
              body.topic = topic;
            }

            responseData = await quePasaApiRequest.call(this, 'POST', '/groups', body);
          } else if (operation === 'updateName') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const name = this.getNodeParameter('name', i) as string;
            responseData = await quePasaApiRequest.call(this, 'PUT', `/groups/${groupId}/name`, { name });
          } else if (operation === 'addParticipants') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantsStr = this.getNodeParameter('participants', i) as string;

            const participants = participantsStr
              .split(',')
              .map(p => formatPhoneNumber(p.trim()))
              .filter(p => p);

            responseData = await quePasaApiRequest.call(this, 'POST', `/groups/${groupId}/participants`, { participants });
          } else if (operation === 'removeParticipant') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantId = this.getNodeParameter('participantId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'DELETE', `/groups/${groupId}/participants/${participantId}`);
          } else if (operation === 'leaveGroup') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/groups/${groupId}/leave`);
          } else if (operation === 'updateDescription') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const description = this.getNodeParameter('description', i) as string;
            responseData = await quePasaApiRequest.call(this, 'PUT', `/groups/${groupId}/description`, { description });
          } else if (operation === 'updatePicture') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const binaryProperty = this.getNodeParameter('binaryProperty', i) as string;

            const binaryData = this.helpers.assertBinaryData(i, binaryProperty);
            const buffer = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
            const base64Data = buffer.toString('base64');

            const body: IDataObject = {
              picture: `data:${binaryData.mimeType};base64,${base64Data}`,
            };

            responseData = await quePasaApiRequest.call(this, 'PUT', `/groups/${groupId}/picture`, body);
          } else if (operation === 'removePicture') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'DELETE', `/groups/${groupId}/picture`);
          } else if (operation === 'promoteToAdmin') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantId = this.getNodeParameter('participantId', i) as string;

            const body: IDataObject = {
              participants: [formatPhoneNumber(participantId)],
            };

            responseData = await quePasaApiRequest.call(this, 'POST', `/groups/${groupId}/admins`, body);
          } else if (operation === 'demoteFromAdmin') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            const participantId = this.getNodeParameter('participantId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'DELETE', `/groups/${groupId}/admins/${participantId}`);
          } else if (operation === 'getInviteLink') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'GET', `/groups/${groupId}/invite`);
          } else if (operation === 'revokeInviteLink') {
            const groupId = this.getNodeParameter('groupId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/groups/${groupId}/invite/revoke`);
          } else if (operation === 'joinViaInvite') {
            const inviteCode = this.getNodeParameter('inviteCode', i) as string;

            const body: IDataObject = {
              code: inviteCode,
            };

            responseData = await quePasaApiRequest.call(this, 'POST', '/groups/join', body);
          }
        }

        // ============================================
        //              CONTACT
        // ============================================
        else if (resource === 'contact') {
          if (operation === 'listContacts') {
            responseData = await quePasaApiRequest.call(this, 'GET', '/contacts');
          } else if (operation === 'getContactInfo') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'GET', `/contacts/${contactId}`);
          } else if (operation === 'checkWhatsApp') {
            const phonesStr = this.getNodeParameter('phones', i) as string;
            const phones = phonesStr
              .split(',')
              .map(p => p.trim().replace(/\D/g, ''))
              .filter(p => p);

            responseData = await quePasaApiRequest.call(this, 'POST', '/contacts/check', { phones });
          } else if (operation === 'getPicture') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

            const response = await quePasaApiRequest.call(
              this,
              'GET',
              `/contacts/${contactId}/picture`,
              {},
              {},
              { returnFullResponse: true, encoding: null }
            );

            const executionData: INodeExecutionData = {
              json: { contactId, success: true },
              binary: {
                [binaryPropertyName]: await this.helpers.prepareBinaryData(
                  response.body as Buffer,
                  `profile_${contactId}.jpg`,
                  response.headers['content-type'] as string
                ),
              },
            };

            returnData.push(executionData);
            continue;
          } else if (operation === 'blockContact') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/contacts/${contactId}/block`);
          } else if (operation === 'unblockContact') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/contacts/${contactId}/unblock`);
          }
        }

        // ============================================
        //              MEDIA
        // ============================================
        else if (resource === 'media') {
          if (operation === 'downloadMedia') {
            const messageId = this.getNodeParameter('messageId', i) as string;
            const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;

            const response = await quePasaApiRequest.call(
              this,
              'GET',
              `/messages/${messageId}/download`,
              {},
              {},
              { returnFullResponse: true, encoding: null }
            );

            const executionData: INodeExecutionData = {
              json: { messageId, success: true },
              binary: {
                [binaryPropertyName]: await this.helpers.prepareBinaryData(
                  response.body as Buffer,
                  `media_${messageId}`,
                  response.headers['content-type'] as string
                ),
              },
            };

            returnData.push(executionData);
            continue;
          } else if (operation === 'downloadAsBase64') {
            const messageId = this.getNodeParameter('messageId', i) as string;

            const response = await quePasaApiRequest.call(
              this,
              'GET',
              `/messages/${messageId}/download`,
              {},
              {},
              { returnFullResponse: true, encoding: null }
            );

            const base64Data = (response.body as Buffer).toString('base64');
            const mimeType = response.headers['content-type'] as string;

            responseData = {
              messageId,
              base64: `data:${mimeType};base64,${base64Data}`,
              mimeType,
            };
          }
        }

        // ============================================
        //              WEBHOOK
        // ============================================
        else if (resource === 'webhook') {
          if (operation === 'setWebhook') {
            const url = this.getNodeParameter('url', i) as string;
            const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

            const body: IDataObject = { url };

            if (additionalOptions.forwardinternal !== undefined) {
              body.forwardinternal = additionalOptions.forwardinternal;
            }
            if (additionalOptions.trackid) {
              body.trackid = additionalOptions.trackid;
            }

            responseData = await quePasaApiRequest.call(this, 'POST', '/webhook', body);
          } else if (operation === 'getWebhook') {
            responseData = await quePasaApiRequest.call(this, 'GET', '/webhook');
          } else if (operation === 'deleteWebhook') {
            responseData = await quePasaApiRequest.call(this, 'DELETE', '/webhook');
          } else if (operation === 'updateWebhook') {
            const url = this.getNodeParameter('url', i) as string;
            const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as IDataObject;

            const body: IDataObject = { url };

            if (additionalOptions.forwardinternal !== undefined) {
              body.forwardinternal = additionalOptions.forwardinternal;
            }
            if (additionalOptions.trackid) {
              body.trackid = additionalOptions.trackid;
            }

            responseData = await quePasaApiRequest.call(this, 'PUT', '/webhook', body);
          }
        }

        // ============================================
        //              CHAT
        // ============================================
        else if (resource === 'chat') {
          if (operation === 'markAsRead') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/markasread`);
          } else if (operation === 'archiveChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/archive`);
          } else if (operation === 'unarchiveChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/unarchive`);
          } else if (operation === 'pinChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/pin`);
          } else if (operation === 'unpinChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/unpin`);
          } else if (operation === 'muteChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            const duration = this.getNodeParameter('duration', i, 28800) as number;

            const body: IDataObject = {
              duration,
            };

            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/mute`, body);
          } else if (operation === 'unmuteChat') {
            const chatId = this.getNodeParameter('chatId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', `/chats/${chatId}/unmute`);
          }
        }

        // ============================================
        //              STATUS
        // ============================================
        else if (resource === 'status') {
          if (operation === 'updatePresence') {
            const presence = this.getNodeParameter('presence', i) as string;
            responseData = await quePasaApiRequest.call(this, 'POST', '/presence', { presence });
          } else if (operation === 'updateStatus') {
            const statusText = this.getNodeParameter('statusText', i) as string;

            const body: IDataObject = {
              status: statusText,
            };

            responseData = await quePasaApiRequest.call(this, 'POST', '/status', body);
          } else if (operation === 'getContactStatus') {
            const contactId = this.getNodeParameter('contactId', i) as string;
            responseData = await quePasaApiRequest.call(this, 'GET', `/contacts/${contactId}/status`);
          }
        }

        const executionData = this.helpers.constructExecutionMetaData(
          this.helpers.returnJsonArray(responseData as IDataObject | IDataObject[]),
          { itemData: { item: i } }
        );
        returnData.push(...executionData);

      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({
            json: {
              error: errorMessage,
            },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
