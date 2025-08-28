import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import type { FieldErrors } from 'react-hook-form'

import Text from './Text'

interface FieldProps {
  onChange: (value: string | null) => void
  value: string | null
  name: string
}

interface SelectProps {
  title?: string
  field: FieldProps
  errors?: FieldErrors
  required?: boolean
  labelInCol?: boolean
  showTimer?: boolean
  format?: string
  disabled?: boolean
  disablePastDate?: boolean
  onChange?: (value: string | null) => void
  inputIcon?: React.ReactNode
  inputIconImage?: string
  placeholder?: [string, string]
}

const { RangePicker } = DatePicker

function CustomRangeDatePicker(props: SelectProps) {
  const {
    field,
    errors,
    showTimer,
    format,
    disabled,
    disablePastDate = true,
    onChange,
    inputIcon,
    inputIconImage,
    placeholder,
  } = props

  return (
    <div className="mb-4 w-full">
      <div
        className={` ${errors && errors[field.name] ? 'border-darkPink bg-lightPink border-r-8' : 'border-transparent bg-white'} rounded-10 shadow-custom relative flex h-[51px] w-full items-center gap-2 border px-3 duration-200`}
      >
        {(inputIcon || inputIconImage) &&
          (inputIconImage ? (
            <img src={inputIconImage} alt="icon" width={20} height={20} className="select-none" />
          ) : (
            <div className="text-lightGray2 flex h-[20px] w-[20px] select-none items-center justify-center">
              {inputIcon}
            </div>
          ))}

        <RangePicker
          showTime={showTimer ? { format: 'HH:mm' } : false}
          disabledDate={(current) => {
            return disablePastDate ? current && current < dayjs().startOf('day') : false
          }}
          disabled={disabled}
          variant="borderless"
          format={format || 'YYYY-MM-DD'}
          onChange={(value) => {
            field.onChange(value as unknown as string)
            onChange?.(value as unknown as string)
          }}
          placeholder={placeholder}
          value={field.value ? JSON.parse(field.value).map((date: string) => dayjs(date)) : null}
          className={`${errors && errors[field.name] && 'rangePicker-error'} rangePicker`}
        />
      </div>

      {errors && errors[field.name] && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          {String(errors[field.name]?.message || '')}
        </Text>
      )}
    </div>
  )
}

export default CustomRangeDatePicker
