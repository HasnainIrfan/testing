import { TimePicker } from 'antd'
import type { FieldErrors } from 'react-hook-form'

import Text from './Text'

interface FieldProps {
  onChange: (value: string) => void
  value: string
  name: string
}

interface TimePickerType {
  field: FieldProps
  errors?: FieldErrors
}

function CustomTimePicker(props: TimePickerType) {
  const { field, errors } = props

  return (
    <div className="mb-4 w-full">
      <div className="rounded-10 shadow-custom relative flex w-full items-center gap-2 border duration-200">
        <TimePicker.RangePicker
          className={`${
            errors && errors[field.name] ? 'ant-time-picker-error' : 'ant-time-picker'
          }`}
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

export default CustomTimePicker
