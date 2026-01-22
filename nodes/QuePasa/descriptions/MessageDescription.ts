import { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['message'],
      },
    },
    options: [
      {
        name: 'Send Text',
        value: 'sendText',
        description: 'Send a text message',
        action: 'Send text message',
      },
      {
        name: 'Send Media',
        value: 'sendMedia',
        description: 'Send media (image, video, audio, document)',
        action: 'Send media message',
      },
      {
        name: 'Send From URL',
        value: 'sendFromUrl',
        description: 'Send media from URL',
        action: 'Send media from URL',
      },
      {
        name: 'Revoke Message',
        value: 'revokeMessage',
        description: 'Delete/revoke a sent message',
        action: 'Revoke message',
      },
      {
        name: 'React to Message',
        value: 'reactToMessage',
        description: 'React to a message with emoji',
        action: 'React to message',
      },
      {
        name: 'Forward Message',
        value: 'forwardMessage',
        description: 'Forward a message to another chat',
        action: 'Forward message',
      },
      {
        name: 'Get History',
        value: 'getHistory',
        description: 'Get message history from a chat',
        action: 'Get message history',
      },
    ],
    default: 'sendText',
  },
];

export const messageFields: INodeProperties[] = [
  // Common fields
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendText', 'sendMedia', 'sendFromUrl'],
      },
    },
    default: '',
    placeholder: '5511999999999 or 5511999999999@s.whatsapp.net',
    description: 'Phone number or chat ID',
  },

  // Send Text
  {
    displayName: 'Message',
    name: 'text',
    type: 'string',
    required: true,
    typeOptions: {
      rows: 4,
    },
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendText'],
      },
    },
    default: '',
    description: 'Text message to send',
  },

  // Send Media
  {
    displayName: 'Media Type',
    name: 'mediaType',
    type: 'options',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendMedia'],
      },
    },
    options: [
      { name: 'Image', value: 'image' },
      { name: 'Video', value: 'video' },
      { name: 'Audio', value: 'audio' },
      { name: 'Document', value: 'document' },
    ],
    default: 'image',
    description: 'Type of media to send',
  },
  {
    displayName: 'Binary Property',
    name: 'binaryProperty',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendMedia'],
      },
    },
    default: 'data',
    description: 'Name of the binary property containing the file',
  },
  {
    displayName: 'Caption',
    name: 'caption',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendMedia', 'sendFromUrl'],
      },
    },
    default: '',
    description: 'Optional caption for the media',
  },

  // Send from URL
  {
    displayName: 'Media URL',
    name: 'url',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendFromUrl'],
      },
    },
    default: '',
    placeholder: 'https://example.com/image.jpg',
    description: 'Direct URL to the media file',
  },
  {
    displayName: 'Filename',
    name: 'filename',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendFromUrl'],
      },
    },
    default: '',
    description: 'Custom filename (optional)',
  },

  // Revoke Message
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['revokeMessage'],
      },
    },
    default: '',
    description: 'ID of the message to revoke',
  },

  // React to Message
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['reactToMessage', 'forwardMessage'],
      },
    },
    default: '',
    description: 'ID of the message',
  },
  {
    displayName: 'Emoji',
    name: 'emoji',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['reactToMessage'],
      },
    },
    default: '👍',
    placeholder: '👍 or ❤️ or 😂',
    description: 'Emoji to react with',
  },

  // Forward Message
  {
    displayName: 'To Chat ID',
    name: 'toChatId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['forwardMessage'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'Chat ID to forward the message to',
  },

  // Get History
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getHistory'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'Chat ID to get history from',
  },
  {
    displayName: 'Limit',
    name: 'limit',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['getHistory'],
      },
    },
    default: 50,
    description: 'Number of messages to retrieve (max 100)',
  },

  // Additional Options
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['message'],
        operation: ['sendText', 'sendMedia', 'sendFromUrl'],
      },
    },
    options: [
      {
        displayName: 'Track ID',
        name: 'trackId',
        type: 'string',
        default: '',
        description: 'Custom tracking ID',
      },
    ],
  },
];
