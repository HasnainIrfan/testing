import { useState } from 'react'

import { Select } from 'antd'
import type { FieldErrors } from 'react-hook-form'

import { useDebouncedSearch } from '@/utils/helper'

import Text from './Text'

interface SelectBoxOption {
  label: string
  value: string
}

interface SelectProps {
  title: string
  options: SelectBoxOption[]
  field: {
    onChange: (value: string[]) => void
    onBlur: () => void
    value: string[]
    name: string
  }
  errors?: FieldErrors
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

function SelectInput(props: SelectProps) {
  const {
    options,
    field,
    errors,
    placeholder,
    disabled,
    style,
    loading,
    onclick,
    onSearch,
    showValue,
    labelInValue,
    inputIcon,
    inputIconImage,
    mode = undefined,
    onChange,
    allowClear = false,
    className,
    marginBottom = true,
    maxWidth = false,
  } = props

  const [isLoading, setIsLoading] = useState(false)

  const handleDebouncedSearch = useDebouncedSearch(onSearch)

  const selectedItems = field.value || []

  const filterOption = (input: string, option?: { label: string; value: string }) =>
    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())

  const handleSearch = (value: string) => {
    setIsLoading(true)
    handleDebouncedSearch(value)
  }

  const mainLoading = isLoading || loading

  return (
    <div
      className={`${marginBottom ? 'mb-4' : ''} ${maxWidth ? `max-w-[${maxWidth}]` : ''} w-full`}
    >
      <div
        className={`${className} ${errors && errors[field.name] ? 'border-darkPink bg-lightPink border-r-8' : 'border-transparent bg-white'} rounded-10 shadow-custom relative flex max-h-full min-h-[51px] w-full items-center gap-2 border pl-3 pr-3 duration-200`}
      >
        {(inputIcon || inputIconImage) &&
          (inputIconImage ? (
            <img src={inputIconImage} alt="icon" width={20} height={20} className="select-none" />
          ) : (
            <div className="text-lightGray2 flex h-[20px] w-[20px] select-none items-center justify-center">
              {inputIcon}
            </div>
          ))}

        <Select
          className={`w-full ${maxWidth ? 'antd_select_max_width' : ''}`}
          placeholder={placeholder}
          size="small"
          disabled={disabled}
          style={style}
          loading={mainLoading}
          allowClear={allowClear}
          onChange={(value) => {
            field.onChange(value)
            onChange?.(value as unknown as string)
          }}
          mode={mode}
          variant="borderless"
          onBlur={field.onBlur}
          value={selectedItems}
          showSearch
          labelInValue={labelInValue || false}
          onSearch={onSearch ? handleSearch : undefined}
          filterOption={filterOption}
          onClick={onclick}
          options={options}
        >
          {options?.map((option) => (
            <Select.Option key={option.value} value={option.value} label={option.label}>
              <div className="flex w-full justify-between">
                {option.label} {showValue && <div>{option.value}</div>}
              </div>
            </Select.Option>
          ))}
        </Select>
      </div>
      {errors && errors[field.name] && (
        <Text containerTag="h6" className="text-red ml-1 mt-1 text-xs font-semibold">
          {String(errors[field.name]?.message || '')}
        </Text>
      )}
    </div>
  )
}

export default SelectInput
