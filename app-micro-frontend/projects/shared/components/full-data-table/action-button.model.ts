export interface ActionButton {
  id: string;
  uuid?: string;
  label: string;
  icon?: string;
  image?: string;
  title: string;
  textColor?: string;
  class?: string;
  loading_message?: string;
  confirm_message?: string;
  confirm_first?: boolean;
  action: string; // unique action that will be emitted to you
}
