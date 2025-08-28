import { useState } from 'react'

import type { FieldErrors } from 'react-hook-form'
import { FaEye } from 'react-icons/fa'
import { FaEyeSlash } from 'react-icons/fa6'

import Text from './Text'

interface InputProps {
  type?: string
  label: string
  title?: string
  placeholder?: string
  errors?: FieldErrors
  check?: {
    required?: string
    minLength?: number
    maxLength?: number
    pattern?: RegExp
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  }
  value?: string
  register?: (label: string, check?: { minLength?: number | undefined; pattern?: RegExp }) => void
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  onClick?: () => void
  disabled?: boolean
  style?: React.CSSProperties
  extraClasses?: string
  bgColor?: string
  eyesColor?: string
  inputIcon?: React.ReactNode
  inputIconImage?: string
  borderRadious?: string
  customPadding?: string
  className?: string
  rightImage?: string
  rightIcon?: React.ReactNode
}

function Input(props: InputProps) {
  const [showPassword, setShowPassword] = useState(false)
  const {
    type,
    placeholder,
    label,
    check,
    errors,
    value,
    register,
    name,
    onClick,
    disabled,
    style,
    extraClasses,
    bgColor,
    eyesColor,
    inputIcon,
    inputIconImage,
    borderRadious,
    customPadding,
    className,
    rightIcon,
    rightImage,
  } = props

  const handleTogglePassword = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className={`${className}`}>
      <div
        className={`shadow-custom relative flex items-center gap-2 border ${
          errors && errors[label]
            ? `border-darkPink bg-lightPink border-r-8 duration-200`
            : `${bgColor || 'bg-white'} border-transparent duration-200`
        } ${type === 'password' ? 'pr-7' : 'pr-3'} ${borderRadious || 'rounded-10'} ${customPadding || 'px-3 py-[14px]'} `}
      >
        {(inputIcon || inputIconImage) &&
          (inputIconImage ? (
            <div className="relative h-5 w-5">
              <img src={inputIconImage} alt="icon" className="select-none" />
            </div>
          ) : (
            <div className="flex h-[20px] w-[20px] select-none items-center justify-center">
              {inputIcon}
            </div>
          ))}
        <input
          {...(register ? register(label, check) : {})}
          type={type === 'password' && showPassword ? 'text' : type}
          value={value}
          onClick={onClick}
          placeholder={placeholder || 'Type here ...'}
          disabled={disabled}
          style={style}
          className={`${extraClasses} placeholder:text-grayColor3 h-full w-full bg-transparent pr-3 text-sm outline-none placeholder:text-sm`}
        />
        {type === 'password' && (
          <div
            className={`absolute right-3 cursor-pointer text-xl ${eyesColor || 'text-lightGray'}`}
            onClick={handleTogglePassword}
          >
            {showPassword ? <FaEye color="#CCCCCC" /> : <FaEyeSlash color="#CCCCCC" />}
          </div>
        )}

        {(rightIcon || rightImage) &&
          (rightImage ? (
            <img src={rightImage} alt="icon" width={20} height={20} className="select-none" />
          ) : (
            <div className="flex h-[20px] w-[20px] select-none items-center justify-center">
              {rightIcon}
            </div>
          ))}
      </div>
      {errors && errors[label]?.message && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          {String(errors[label]?.message || '') || ''}
        </Text>
      )}
      {/* Pattern */}
      {label === 'name' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Name Must Be Alphabet
        </Text>
      )}
      {label === 'last_name' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Last Name Must Be Alphabet
        </Text>
      )}
      {label === 'email' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Please Enter A Valid Email
        </Text>
      )}

      {label === 'days' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Please Enter A Valid Days
        </Text>
      )}
      {label === 'age' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Please Enter A Valid Age
        </Text>
      )}

      {label === 'code' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Please Enter A Valid Code
        </Text>
      )}
      {label === 'video_url' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Invalid video url
        </Text>
      )}

      {label === 'zoom_link' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Invalid Zoom Link
        </Text>
      )}
      {label === 'meeting_link' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Invalid Meeting Link
        </Text>
      )}
      {label === 'class_size' && errors?.[label]?.type === 'pattern' && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          Please Enter A Valid RSVP Number (1-1000000)
        </Text>
      )}
      {(label === 'url' || label === 'link_to_redirect_to') &&
        errors?.[label]?.type === 'pattern' && (
          <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
            Invalid video url
          </Text>
        )}
      {/* Min or Max Length */}
      {errors &&
        ((errors[label]?.type === 'minLength' && check?.minLength) ||
          (errors[label]?.type === 'maxLength' && check?.maxLength && !check?.minLength)) && (
          <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
            {`${name} must be ${
              check.minLength && check.maxLength
                ? `between ${check.minLength} and ${check.maxLength} characters`
                : check.minLength
                  ? `at least ${check.minLength} characters`
                  : check.maxLength
                    ? `at most ${check.maxLength} characters`
                    : ''
            }`}
          </Text>
        )}
    </div>
  )
}

export default Input
