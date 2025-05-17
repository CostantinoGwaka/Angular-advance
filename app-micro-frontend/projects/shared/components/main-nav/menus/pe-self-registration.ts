import {MenuOption} from "../menu-options";

export const PeSelfRegistration:MenuOption[] = [
  {
    name: 'User Management',
    shortName: 'User Management',
    authority:'ROLE_MODULES_USR_MNGT',
    permission: [
      {
        key: "ROLE_MODULES_USR_MNGT",
        action: "View user management"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_EDT_PE",
        action: "Edit PE details"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_CREATE",
        action: "Create users"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_DELETE",
        action: "Delete users"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_EDIT",
        action: "Edit users"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_RESEND",
        action: "Resend Activation Token"
      },
      {
        key: "ROLE_MODULES_USR_MNGT_LOCK_UNLOCK_USER",
        action: "Lock/Unlock Users"
      }
    ],
    route: ['', 'pe-self-registration'],
    pathRoute: ['', 'pe-self-registration'],
    description: 'Manage Procuring Entities Users',
    icon: 'institutions',
    iconType: 'SVG',
  }
]
