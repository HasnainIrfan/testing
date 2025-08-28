export type ButtonPropsType = {
  children: React.ReactNode
  loading?: boolean
  onClick?: () => void
  textColor?: string
  fontSize?: string
  style?: React.CSSProperties
  fontWeight?: string
  bgColor?: string
  Size?: string
  variant?: string
  hover?: string
  border?: string
  className?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  customStyles?: React.CSSProperties
  customLeftImage?: React.ReactNode
  customRightImage?: React.ReactNode
  borderRadius?: string
}
