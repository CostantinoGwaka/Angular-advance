export interface CustomAlertBoxModel {
  title?: string,
  buttonTitle?: string,
  showButton?: boolean,
  details?: CustomAlertBoxModelDetails[]
}

export interface CustomAlertBoxModelDetails {
  icon?: string,
  message: string
}
