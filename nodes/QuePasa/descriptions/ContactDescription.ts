import { INodeProperties } from 'n8n-workflow';

export const contactOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['contact'],
      },
    },
    options: [
      {
        name: 'Check WhatsApp',
        value: 'checkWhatsApp',
        description: 'Check if phone numbers are on WhatsApp',
        action: 'Check if on whats app',
      },
      {
        name: 'List Contacts',
        value: 'listContacts',
        description: 'List all contacts',
        action: 'List all contacts',
      },
      {
        name: 'Get Contact Info',
        value: 'getContactInfo',
        description: 'Get contact information',
        action: 'Get contact information',
      },
      {
        name: 'Get Picture',
        value: 'getPicture',
        description: 'Get contact profile picture',
        action: 'Get profile picture',
      },
      {
        name: 'Block Contact',
        value: 'blockContact',
        description: 'Block a contact',
        action: 'Block contact',
      },
      {
        name: 'Unblock Contact',
        value: 'unblockContact',
        description: 'Unblock a contact',
        action: 'Unblock contact',
      },
    ],
    default: 'checkWhatsApp',
  },
];

export const contactFields: INodeProperties[] = [
  // Check WhatsApp
  {
    displayName: 'Phone Numbers',
    name: 'phones',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['checkWhatsApp'],
      },
    },
    default: '',
    placeholder: '5511999999999, 5511888888888',
    description: 'Phone numbers to check (comma-separated)',
  },

  // Get Contact Info / Picture / Block / Unblock
  {
    displayName: 'Contact ID',
    name: 'contactId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getContactInfo', 'getPicture', 'blockContact', 'unblockContact'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'Contact ID',
  },

  // Get Picture Options
  {
    displayName: 'Binary Property Name',
    name: 'binaryPropertyName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['contact'],
        operation: ['getPicture'],
      },
    },
    default: 'data',
    description: 'Name of the binary property to store the picture',
  },
];
