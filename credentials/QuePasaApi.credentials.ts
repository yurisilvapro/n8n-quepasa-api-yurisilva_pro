import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class QuePasaApi implements ICredentialType {
  name = 'quePasaApi';
  displayName = 'QuePasa API';
  documentationUrl = 'https://github.com/nocodeleaks/quepasa';
  properties: INodeProperties[] = [
    {
      displayName: 'Server URL',
      name: 'serverUrl',
      type: 'string',
      default: 'http://localhost:31000',
      placeholder: 'http://localhost:31000',
      description: 'QuePasa server URL',
      required: true,
    },
    {
      displayName: 'Accounts',
      name: 'accounts',
      type: 'fixedCollection',
      typeOptions: {
        multipleValues: true,
      },
      default: {},
      placeholder: 'Add Account',
      options: [
        {
          name: 'account',
          displayName: 'Account',
          values: [
            {
              displayName: 'Account Name',
              name: 'name',
              type: 'string',
              default: '',
              placeholder: 'Main Account',
              description: 'Friendly name to identify this account',
            },
            {
              displayName: 'Token',
              name: 'token',
              type: 'string',
              typeOptions: {
                password: true,
              },
              default: '',
              description: 'API Token for this account',
              required: true,
            },
            {
              displayName: 'User ID',
              name: 'userId',
              type: 'string',
              default: '',
              placeholder: 'admin',
              description: 'User ID for this account',
            },
            {
              displayName: 'Phone Number',
              name: 'phone',
              type: 'string',
              default: '',
              placeholder: '5511999999999',
              description: 'Phone number associated with this account',
            },
          ],
        },
      ],
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-QUEPASA-TOKEN': '={{$credentials.token}}',
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: '={{$credentials.serverUrl}}',
      url: '/info',
      headers: {
        'X-QUEPASA-TOKEN': '={{$credentials.accounts?.account?.[0]?.token}}',
      },
    },
  };
}
