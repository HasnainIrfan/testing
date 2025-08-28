import React from 'react'

import { Radio } from 'antd'
import type { RadioChangeEvent } from 'antd'
import type { FieldValues } from 'react-hook-form'

import Text from './Text'

type OptionsTypes = {
  label: string
  value: string | boolean
}

interface SolidRadioPropsTypes {
  title: string
  option: OptionsTypes[]
  field: FieldValues
  style?: React.CSSProperties
  labelInCol?: boolean
  onChange?: (e: RadioChangeEvent) => void
  fontSize?: string
  disabled?: boolean
}

function SolidRadio(props: SolidRadioPropsTypes) {
  const { title, option, field, style, labelInCol, onChange, disabled } = props

  const handleChange = (e: RadioChangeEvent) => {
    field.onChange(e.target.value)
    if (onChange) {
      onChange(e)
    }
  }
  return (
    <div className={`flex w-full justify-between gap-3 ${labelInCol ? 'flex-col' : 'flex-row'}`}>
      <Text containerTag="h6" className={`text-grayColor2 mt-1 flex flex-1 text-sm font-semibold`}>
        {title}
      </Text>
      <div>
        <Radio.Group
          buttonStyle="solid"
          style={style}
          disabled={disabled}
          defaultValue={field.value}
          value={field.value}
          onChange={handleChange}
          onBlur={field.onBlur}
        >
          {option?.map((item, i) => (
            <Radio.Button value={item.value} key={i as number}>
              {item.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      </div>
    </div>
  )
}

export default SolidRadio
