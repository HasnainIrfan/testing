import React from 'react'

import type { DatePickerProps } from 'antd'
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
  field: FieldProps
  errors?: FieldErrors
  placeholder?: string
  disabled?: boolean
  style?: React.CSSProperties
  required?: boolean
  disableDate?: boolean
  disablePastDate?: boolean
  labelInCol?: boolean
  isMultiple?: boolean
  picker?: 'time' | 'date' | 'week' | 'month' | 'year'
  size?: 'large' | 'middle' | 'small'
  format?: string
  showTime?: boolean
  disableCustomDateRange?: {
    start: string | null
    end: string | null
  } | null
  inputIcon?: React.ReactNode
  inputIconImage?: string
}

function CustomDatePicker(props: SelectProps) {
  const {
    field,
    errors,
    placeholder,
    disabled,
    style,
    disableDate,
    disablePastDate,
    isMultiple = false,
    picker = 'date',
    size = 'middle',
    disableCustomDateRange = null,
    format,
    showTime = false,
    inputIcon,
    inputIconImage,
  } = props

  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    if (isMultiple && Array.isArray(dateString)) {
      const isoDates = dateString.map((date) => (date ? dayjs(date).toISOString() : null))
      field.onChange(isoDates as unknown as string)
    } else {
      const isoDate = date ? dayjs(date).toISOString() : null
      field.onChange(isoDate)
    }
  }

  const disabledDate = (current: dayjs.Dayjs | null) => {
    if (disableCustomDateRange) {
      return (
        current &&
        (current < dayjs(disableCustomDateRange.start) ||
          current > dayjs(disableCustomDateRange.end))
      )
    }
    if (disableDate) {
      return current !== null && current > dayjs().endOf('day')
    }
    if (disablePastDate) {
      return current !== null && current < dayjs().startOf('day')
    }
    return false
  }

  return (
    <div className="mb-4 w-full">
      <div
        className={` ${errors && errors[field.name] ? 'border-darkPink bg-lightPink border-r-8' : 'border-transparent bg-white'} rounded-10 shadow-custom relative flex h-[51px] w-full items-center gap-2 border pl-3 pr-3 duration-200`}
      >
        {(inputIcon || inputIconImage) &&
          (inputIconImage ? (
            <img src={inputIconImage} alt="icon" width={20} height={20} className="select-none" />
          ) : (
            <div className="text-lightGray2 flex h-[20px] w-[20px] select-none items-center justify-center">
              {inputIcon}
            </div>
          ))}
        <DatePicker
          onChange={onChange}
          placeholder={placeholder || 'Select Date'}
          disabled={disabled}
          style={style}
          showTime={showTime || false}
          value={
            (isMultiple
              ? field.value && Array.isArray(field.value)
                ? field.value.map((date: string) => (date ? dayjs(date) : null))
                : []
              : field.value
                ? dayjs(field.value)
                : null) as dayjs.Dayjs | null | undefined
          }
          variant="borderless"
          format={format || 'DD/MM/YYYY'}
          disabledDate={(current) => disabledDate(current) || false}
          multiple={isMultiple}
          className="w-full"
          size={size}
          picker={picker}
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

export default CustomDatePicker
