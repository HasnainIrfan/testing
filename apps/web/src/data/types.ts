export type SelectOption = {
  label: string
  value?: string
  src?: string
  leadingIcon?: React.ReactNode
  children?: React.ReactNode
  icon?: React.ReactNode
}

export type RadioOptionTypes = {
  label: string
  value: boolean | string
}

export type GenderOptionType = {
  label: string
  value: string
}

export type AuthSliderDataTypes = {
  title: string
  description: string
  src: string
}

export type SidebarItems = {
  title: string
  href: string
}

export interface SelectBoxOption {
  label: string
  value: string
}

export interface PaginationType {
  page: number
  pageSize: number
}
