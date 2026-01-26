import React from 'react'
import { Slider, InputNumber } from '@douyinfe/semi-ui'

interface SliderInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
}

const SliderInput: React.FC<SliderInputProps> = ({ value, onChange, min = 0, max = 100, step = 1, label }) => {
  const handleSliderChange = (val: number | number[] | undefined) => {
    if (typeof val === 'number') {
      onChange(val)
    }
  }

  const handleInputChange = (val: number | string | undefined) => {
    if (typeof val === 'number' && val >= min && val <= max) {
      onChange(val)
    }
  }

  return (
    <div className="slider-input-container">
      {label && <span className="slider-label">{label}</span>}
      <div className="slider-input-wrapper">
        <Slider
          value={value}
          onChange={handleSliderChange}
          min={min}
          max={max}
          step={step}
          style={{ flex: 1, minWidth: '100px' }}
        />
        <InputNumber
          value={value}
          onChange={handleInputChange}
          min={min}
          max={max}
          step={step}
          style={{ width: '70px', marginLeft: '10px' }}
        />
      </div>
    </div>
  )
}

export default SliderInput