import { INodeProperties } from 'n8n-workflow';

export const chatOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['chat'],
      },
    },
    options: [
      {
        name: 'Mark as Read',
        value: 'markAsRead',
        description: 'Mark chat as read',
        action: 'Mark chat as read',
      },
      {
        name: 'Archive Chat',
        value: 'archiveChat',
        description: 'Archive a chat',
        action: 'Archive chat',
      },
      {
        name: 'Unarchive Chat',
        value: 'unarchiveChat',
        description: 'Unarchive a chat',
        action: 'Unarchive chat',
      },
      {
        name: 'Pin Chat',
        value: 'pinChat',
        description: 'Pin a chat',
        action: 'Pin chat',
      },
      {
        name: 'Unpin Chat',
        value: 'unpinChat',
        description: 'Unpin a chat',
        action: 'Unpin chat',
      },
      {
        name: 'Mute Chat',
        value: 'muteChat',
        description: 'Mute chat notifications',
        action: 'Mute chat',
      },
      {
        name: 'Unmute Chat',
        value: 'unmuteChat',
        description: 'Unmute chat notifications',
        action: 'Unmute chat',
      },
    ],
    default: 'markAsRead',
  },
];

export const chatFields: INodeProperties[] = [
  {
    displayName: 'Chat ID',
    name: 'chatId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['chat'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'ID of the chat',
  },
  {
    displayName: 'Duration (seconds)',
    name: 'duration',
    type: 'number',
    displayOptions: {
      show: {
        resource: ['chat'],
        operation: ['muteChat'],
      },
    },
    default: 28800,
    description: 'Mute duration in seconds (default: 8 hours)',
  },
];
