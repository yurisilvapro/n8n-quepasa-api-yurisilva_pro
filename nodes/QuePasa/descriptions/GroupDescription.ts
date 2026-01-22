import { INodeProperties } from 'n8n-workflow';

export const groupOperations: INodeProperties[] = [
  {
    displayName: 'Operation',
    name: 'operation',
    type: 'options',
    noDataExpression: true,
    displayOptions: {
      show: {
        resource: ['group'],
      },
    },
    options: [
      {
        name: 'Add Participants',
        value: 'addParticipants',
        description: 'Add participants to group',
        action: 'Add participants',
      },
      {
        name: 'Create Group',
        value: 'createGroup',
        description: 'Create a new group',
        action: 'Create group',
      },
      {
        name: 'Get Group Info',
        value: 'getGroupInfo',
        description: 'Get details of a specific group',
        action: 'Get group information',
      },
      {
        name: 'Leave Group',
        value: 'leaveGroup',
        description: 'Leave a group',
        action: 'Leave group',
      },
      {
        name: 'List Groups',
        value: 'listGroups',
        description: 'List all groups',
        action: 'List all groups',
      },
      {
        name: 'Remove Participant',
        value: 'removeParticipant',
        description: 'Remove participant from group',
        action: 'Remove participant',
      },
      {
        name: 'Update Name',
        value: 'updateName',
        description: 'Update group name',
        action: 'Update group name',
      },
      {
        name: 'Update Description',
        value: 'updateDescription',
        description: 'Update group description',
        action: 'Update group description',
      },
      {
        name: 'Update Picture',
        value: 'updatePicture',
        description: 'Update group picture',
        action: 'Update group picture',
      },
      {
        name: 'Remove Picture',
        value: 'removePicture',
        description: 'Remove group picture',
        action: 'Remove group picture',
      },
      {
        name: 'Promote to Admin',
        value: 'promoteToAdmin',
        description: 'Promote participant to admin',
        action: 'Promote to admin',
      },
      {
        name: 'Demote from Admin',
        value: 'demoteFromAdmin',
        description: 'Demote admin to participant',
        action: 'Demote from admin',
      },
      {
        name: 'Get Invite Link',
        value: 'getInviteLink',
        description: 'Get group invite link',
        action: 'Get invite link',
      },
      {
        name: 'Revoke Invite Link',
        value: 'revokeInviteLink',
        description: 'Revoke current invite link',
        action: 'Revoke invite link',
      },
      {
        name: 'Join via Invite',
        value: 'joinViaInvite',
        description: 'Join group using invite code',
        action: 'Join via invite',
      },
    ],
    default: 'listGroups',
  },
];

export const groupFields: INodeProperties[] = [
  // Group ID (for most operations)
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['getGroupInfo', 'updateName', 'addParticipants', 'removeParticipant', 'leaveGroup'],
      },
    },
    default: '',
    placeholder: '123456789@g.us',
    description: 'ID of the group',
  },

  // Create Group
  {
    displayName: 'Group Name',
    name: 'name',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['createGroup', 'updateName'],
      },
    },
    default: '',
    description: 'Name of the group',
  },
  {
    displayName: 'Participants',
    name: 'participants',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['createGroup', 'addParticipants'],
      },
    },
    default: '',
    placeholder: '5511999999999, 5511888888888',
    description: 'Phone numbers separated by comma',
  },
  {
    displayName: 'Description',
    name: 'topic',
    type: 'string',
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['createGroup'],
      },
    },
    default: '',
    description: 'Group description (optional)',
  },

  // Remove Participant
  {
    displayName: 'Participant ID',
    name: 'participantId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['removeParticipant', 'promoteToAdmin', 'demoteFromAdmin'],
      },
    },
    default: '',
    placeholder: '5511999999999@s.whatsapp.net',
    description: 'ID of the participant',
  },

  // Update Description
  {
    displayName: 'Group ID',
    name: 'groupId',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['updateDescription', 'updatePicture', 'removePicture', 'promoteToAdmin', 'demoteFromAdmin', 'getInviteLink', 'revokeInviteLink'],
      },
    },
    default: '',
    placeholder: '123456789@g.us',
    description: 'ID of the group',
  },
  {
    displayName: 'Description',
    name: 'description',
    type: 'string',
    required: true,
    typeOptions: {
      rows: 3,
    },
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['updateDescription'],
      },
    },
    default: '',
    description: 'New group description',
  },

  // Update Picture
  {
    displayName: 'Binary Property',
    name: 'binaryProperty',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['updatePicture'],
      },
    },
    default: 'data',
    description: 'Name of the binary property containing the image',
  },

  // Join via Invite
  {
    displayName: 'Invite Code',
    name: 'inviteCode',
    type: 'string',
    required: true,
    displayOptions: {
      show: {
        resource: ['group'],
        operation: ['joinViaInvite'],
      },
    },
    default: '',
    placeholder: 'ABC123DEF456',
    description: 'Invite code from the invite link',
  },
];
