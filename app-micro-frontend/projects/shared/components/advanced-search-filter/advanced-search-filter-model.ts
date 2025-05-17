export interface AdvancedSearchFilterModel {
  label?:string,
  placeholder?:string,
  hint?:string,
  key: string,
  value?: any,
  options?: {
    label: string,
    value: any
  }[]
  inputType?: 'text'| 'option',
  isAdvanced: boolean
}
