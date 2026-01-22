import { INodeProperties } from 'n8n-workflow';

export const mediaOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['media'],
      },
    },
    options: [
      {
        name: 'Download Media',
        value: 'downloadMedia',
        description: 'Download media from a message',
        action: 'Download media',
      },
      {
        name: 'Download as Base64',
        value: 'downloadAsBase64',
        description: 'Download media as Base64 string',
        action: 'Download as base64',
      },
    ],
    default: 'downloadMedia',
  },
];

export const mediaFields: INodeProperties[] = [
  {
    displayName: 'Message ID',
    name: 'messageId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['media'],
        operation: ['downloadMedia', 'downloadAsBase64'],
      },
    },
    default: '',
    description: 'ID of the message containing media',
  },
  {
    displayName: 'Binary Property Name',
    name: 'binaryPropertyName',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['media'],
        operation: ['downloadMedia'],
      },
    },
    default: 'data',
    description: 'Name of the binary property to store the file',
  },
];
