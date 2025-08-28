import type { FieldErrors } from 'react-hook-form'

import Text from './Text'

interface TextAreaProps {
  label: string
  title?: string
  placeholder?: string
  errors?: FieldErrors
  check?: {
    required?: string
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  }
  value?: string
  register?: (label: string, check?: { minLength?: number | undefined; pattern?: RegExp }) => void
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  name?: string
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
  extraClasses?: string
  bgColor?: string
  required?: boolean
  labelInCol?: boolean
  borderRadious?: string
  customPadding?: string
  className?: string
}

function TextArea(props: TextAreaProps) {
  const {
    placeholder,
    label,
    check,
    errors,
    value,
    register,
    onClick,
    disabled,
    style,
    extraClasses,
    bgColor,
    borderRadious,
    customPadding,
    className,
  } = props

  return (
    <div className={`${className}`}>
      <div
        className={`shadow-custom relative flex items-center gap-2 border ${
          errors && errors[label]
            ? `border-darkPink bg-lightPink border-r-8 duration-200`
            : `${bgColor || 'bg-white'} border-transparent duration-200`
        } ${borderRadious || 'rounded-10'} ${customPadding || 'px-3 py-[14px]'} `}
      >
        <textarea
          {...(register ? register(label, check) : {})}
          value={value}
          onClick={onClick}
          placeholder={placeholder}
          disabled={disabled}
          style={style}
          className={`${extraClasses} scrollBar font-fontLight placeholder:font-fontLight placeholder:text-grayColor3 max-h-80 min-h-[100px] w-full border-none bg-transparent text-sm text-black outline-none duration-200 md:text-base`}
        />
      </div>
      {errors && errors[label]?.message && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          {String(errors[label]?.message || '')}
        </Text>
      )}
    </div>
  )
}

export default TextArea
