/* eslint-disable @typescript-eslint/no-explicit-any */
export interface SelectBoxOption {
  label: string
  value: string
}

export interface SelectProps {
  title: string
  options: SelectBoxOption[]
  field: {
    onChange: (value: string[]) => void
    onBlur: () => void
    value: string[] | any
    name: string
  }
  errors?: any
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
  required?: boolean
  loading?: boolean
  onclick?: () => void
  onSearch?: (search: string) => void
  showValue?: boolean
  labelInCol?: boolean
  labelInValue?: boolean
  onChange?: (value: string) => void
  inputIcon?: React.ReactNode
  inputIconImage?: string
  mode?: 'multiple' | 'tags' | undefined
  allowClear?: boolean
  className?: string
  marginBottom?: boolean
  maxWidth?: boolean
}
