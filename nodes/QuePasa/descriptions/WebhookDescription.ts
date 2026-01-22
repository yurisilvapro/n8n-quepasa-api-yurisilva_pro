import { INodeProperties } from 'n8n-workflow';

export const webhookOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
      },
    },
    options: [
      {
        name: 'Set Webhook',
        value: 'setWebhook',
        description: 'Configure webhook URL',
        action: 'Set webhook',
      },
      {
        name: 'Get Webhook',
        value: 'getWebhook',
        description: 'Get current webhook configuration',
        action: 'Get webhook',
      },
      {
        name: 'Delete Webhook',
        value: 'deleteWebhook',
        description: 'Remove webhook configuration',
        action: 'Delete webhook',
      },
      {
        name: 'Update Webhook',
        value: 'updateWebhook',
        description: 'Update webhook configuration',
        action: 'Update webhook',
      },
    ],
    default: 'setWebhook',
  },
];

export const webhookFields: INodeProperties[] = [
  {
    displayName: 'Webhook URL',
    name: 'url',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['setWebhook', 'updateWebhook'],
      },
    },
    default: '',
    placeholder: 'https://webhook.example.com/events',
    description: 'URL to receive webhook events',
  },
  {
    displayName: 'Additional Options',
    name: 'additionalOptions',
    type: 'collection',
    placeholder: 'Add Option',
    default: {},
    displayOptions: {
      show: {
        resource: ['webhook'],
        operation: ['setWebhook', 'updateWebhook'],
      },
    },
    options: [
      {
        displayName: 'Forward Internal',
        name: 'forwardinternal',
        type: 'boolean',
        default: true,
        description: 'Whether to forward internal events',
      },
      {
        displayName: 'Track ID',
        name: 'trackid',
        type: 'string',
        default: '',
        description: 'Custom tracking ID',
      },
    ],
  },
];
