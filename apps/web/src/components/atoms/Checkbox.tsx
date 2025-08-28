import { Checkbox as AntdCheckbox } from 'antd'
import type { CheckboxChangeEvent } from 'antd/lib/checkbox'
import type { FieldErrors } from 'react-hook-form'

function Checkbox({
  field,
  errors,
  disabled,
  name,
  title,
  fontSize,
  onChange,
}: {
  name: string
  field: {
    onChange: (e: CheckboxChangeEvent) => void
    value: boolean
  }
  onChange?: (e: CheckboxChangeEvent) => void
  errors?: FieldErrors
  disabled?: boolean
  title?: string
  fontSize?: string
}) {
  const handleChange = (e: CheckboxChangeEvent) => {
    field?.onChange(e)
    onChange?.(e)
  }

  return (
    <AntdCheckbox
      onChange={handleChange}
      checked={field?.value}
      disabled={disabled}
      className={`${fontSize ? fontSize : 'text-sm'}font-normal text-blueColor2 ${
        errors && errors[name] && 'checkbox-error'
      }`}
    >
      {title}
    </AntdCheckbox>
  )
}

export default Checkbox
