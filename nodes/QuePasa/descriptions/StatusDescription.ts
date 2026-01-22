import { INodeProperties } from 'n8n-workflow';

export const statusOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['status'],
      },
    },
    options: [
      {
        name: 'Update Presence',
        value: 'updatePresence',
        description: 'Update presence (online/offline)',
        action: 'Update presence',
      },
      {
        name: 'Update Status',
        value: 'updateStatus',
        description: 'Update WhatsApp status/about',
        action: 'Update status',
      },
      {
        name: 'Get Contact Status',
        value: 'getContactStatus',
        description: 'Get contact status/about',
        action: 'Get contact status',
      },
    ],
    default: 'updatePresence',
  },
];

export const statusFields: INodeProperties[] = [
  {
    displayName: 'Presence',
    name: 'presence',
    type: 'options',
    required: true,
    displayOptions: {
      show: {
        resource: ['status'],
        operation: ['updatePresence'],
      },
    },
    options: [
      { name: 'Available (Online)', value: 'available' },
      { name: 'Unavailable (Offline)', value: 'unavailable' },
    ],
    default: 'available',
    description: 'Presence status to set',
  },
  {
    displayName: 'Status Text',
    name: 'statusText',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['status'],
        operation: ['updateStatus'],
      },
    },
    default: '',
    placeholder: 'Available',
    description: 'Status/about text to set',
  },
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['status'],
        operation: ['getContactStatus'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'Contact ID to get status from',
  },
];
