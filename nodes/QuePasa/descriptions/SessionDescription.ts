import { INodeProperties } from 'n8n-workflow';

export const sessionOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['session'],
      },
    },
    options: [
      {
        name: 'Get QR Code',
        value: 'getQrCode',
        description: 'Generate QR Code for WhatsApp authentication',
        action: 'Get qr code',
      },
      {
        name: 'Check Status',
        value: 'checkStatus',
        description: 'Check WhatsApp session status',
        action: 'Check session status',
      },
      {
        name: 'Get Info',
        value: 'getInfo',
        description: 'Get account information',
        action: 'Get account info',
      },
      {
        name: 'Disconnect',
        value: 'disconnect',
        description: 'Disconnect WhatsApp session',
        action: 'Disconnect session',
      },
    ],
    default: 'checkStatus',
  },
];

export const sessionFields: INodeProperties[] = [
  // Get QR Code
  {
    displayName: 'User ID',
    name: 'userId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getQrCode'],
      },
    },
    default: '',
    placeholder: 'admin',
    description: 'User ID to manage this connection',
  },
  {
    displayName: 'Token',
    name: 'token',
    type: 'string',
				typeOptions: { password: true },
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getQrCode'],
      },
    },
    default: '',
    description: 'Leave empty to generate a new token',
  },
  {
    displayName: 'Return QR as Image',
    name: 'returnAsImage',
    type: 'boolean',
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['getQrCode'],
      },
    },
    default: true,
    description: 'Whether to return QR Code as binary image data',
  },
  
  // Disconnect
  {
    displayName: 'Confirmation',
    name: 'confirmation',
    type: 'boolean',
    required: true,
    displayOptions: {
      show: {
        resource: ['session'],
        operation: ['disconnect'],
      },
    },
    default: false,
    description: 'Whether you confirm disconnecting this session',
  },
];
