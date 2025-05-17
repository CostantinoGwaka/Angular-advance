import {MenuOption} from "../menu-options";

export const NestCommunicationTool:MenuOption[]=[
  {
    name: 'Messages',
    shortName: 'Messages',
    route: ['', 'modules', 'nest-communication-tool'],
    pathRoute: ['', 'modules', 'nest-communication-tool','tenderer-communication'],
    description: 'Official Communication Tool',
    icon: 'message',
    iconType: 'SVG',
    authority:'ROLE_MODULES_MESSAGES',
    permission: [
      {
      key: "ROLE_MODULES_MESSAGES",
      action: "View messages"
    }
    ],
    children: [
      // {
      //   name: 'Inbox',
      //   permission: [],
      //   route: ['', 'modules', 'nest-communication-tool', 'inbox'],
      //   icon: 'message',
      //   iconType: 'SVG',
      // },
      {
        name: 'Tenderer Notification',
        authority:"ROLE_MESSAGES_SEND_NOTIFICATION_TENDERER",
        permission: [
          {
            key: "ROLE_MESSAGES_SEND_NOTIFICATION_TENDERER",
            action: "View tenderer notification"
          }],
        route: [
          '',
          'modules',
          'nest-communication-tool',
          'tenderer-communication',
        ],
        icon: 'message',
        iconType: 'SVG',
      },
      {
        name: 'PE and Tenderer Notification',
        authority:"ROLE_MESSAGES_SEND_NOTIFICATION",
        permission: [
          {
          key: "ROLE_MESSAGES_SEND_NOTIFICATION",
          action: "View PE notification"
        }],
        route: [
          '',
          'modules',
          'nest-communication-tool',
          'pe-tenderer-communication',
        ],
        icon: 'message',
        iconType: 'SVG',
      },
    ],
  }
]
