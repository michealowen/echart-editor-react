import React, { useState, useEffect } from 'react'
import ReactDataSheet from 'react-datasheet'
import 'react-datasheet/lib/react-datasheet.css'
import { Switch, Select, Slider, InputNumber, Collapse, Descriptions } from '@douyinfe/semi-ui'
import './editor-panel/EditorPanel.css'

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

interface ConfigDescriptionsProps {
  data: Array<{ key: string; value: React.ReactNode }>
}

const ConfigDescriptions: React.FC<ConfigDescriptionsProps> = ({ data }) => {
  return (
    <Descriptions
      align="left"
      className="config-descriptions"
      data={data}
    />
  )
}

interface EChartsOption {
  legend?: {}
  tooltip?: {
    trigger?: string
    showContent?: boolean
  }
  dataset?: {
    source: any[][]
  }
  xAxis?: {
    type?: string
  }
  yAxis?: {
    gridIndex?: number
  }
  grid?: {
    top?: string
  }
  series?: Array<{
    type?: string
    smooth?: boolean
    seriesLayoutBy?: string
    id?: string
    radius?: string
    center?: [string, string]
    emphasis?: {
      focus?: string
    }
    label?: {
      formatter?: string
    }
    encode?: {
      itemName?: string
      value?: string
      tooltip?: string
    }
  }>
}

interface ConfigPanelProps {
  option: EChartsOption
  onChange: (option: EChartsOption) => void
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ option, onChange }) => {
  const [localOption, setLocalOption] = useState<EChartsOption>(option)
  const [activeKeys, setActiveKeys] = useState<string[]>([])

  // 当外部option变化时，更新本地状态
  useEffect(() => {
    setLocalOption(option)
  }, [option])

  // 更新配置项并通知父组件
  const updateConfig = (updates: Partial<EChartsOption>) => {
    const newOption = { ...localOption, ...updates }
    setLocalOption(newOption)
    onChange(newOption)
  }

  // 更新图例配置
  const handleLegendChange = (checked: boolean) => {
    updateConfig({
      legend: checked ? {} : undefined
    })
  }

  // 更新提示框配置
  const handleTooltipChange = (checked: boolean) => {
    updateConfig({
      tooltip: checked ? {
        trigger: 'axis',
        showContent: false
      } : undefined
    })
  }

  // 更新提示框触发方式
  const handleTooltipTriggerChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (value === undefined || typeof value !== 'string') return;
    updateConfig({
      tooltip: {
        ...(localOption.tooltip || {}),
        trigger: value
      }
    })
  }

  // 更新X轴类型
  const handleXAxisTypeChange = (value: string | number | any[] | Record<string, any> | undefined) => {
    if (value === undefined || typeof value !== 'string') return;
    updateConfig({
      xAxis: {
        ...(localOption.xAxis || {}),
        type: value
      }
    })
  }

  // 更新Grid位置
  const handleGridTopChange = (value: number) => {
    updateConfig({
      grid: {
        ...(localOption.grid || {}),
        top: `${value}%`
      }
    })
  }

  // 更新系列类型
  const handleSeriesTypeChange = (index: number, value: string) => {
    const newSeries = [...localOption.series!]
    newSeries[index] = {
      ...newSeries[index],
      type: value
    }
    updateConfig({
      series: newSeries
    })
  }

  // 更新折线图平滑度
  const handleSmoothChange = (index: number, checked: boolean) => {
    const newSeries = [...localOption.series!]
    newSeries[index] = {
      ...newSeries[index],
      smooth: checked
    }
    updateConfig({
      series: newSeries
    })
  }

  // 更新饼图半径
  const handlePieRadiusChange = (index: number, value: number) => {
    const newSeries = [...localOption.series!]
    newSeries[index] = {
      ...newSeries[index],
      radius: `${value}%`
    }
    updateConfig({ series: newSeries })
  }

  // 获取饼图半径的数值
  const getPieRadiusValue = (radius?: string): number => {
    if (!radius) return 30
    const match = radius.match(/^(\d+)%$/)
    return match ? parseInt(match[1]) : 30
  }

  // 更新饼图中心位置
  const handlePieCenterChange = (index: number, axis: 'x' | 'y', value: number) => {
    const newSeries = [...localOption.series!]
    const currentCenter = newSeries[index].center || ['50%', '50%']
    const newCenter: [string, string] = axis === 'x'
      ? [`${value}%`, currentCenter[1]]
      : [currentCenter[0], `${value}%`]
    newSeries[index] = {
      ...newSeries[index],
      center: newCenter
    }
    updateConfig({ series: newSeries })
  }

  // 获取饼图中心位置的数值
  const getPieCenterValue = (axis: 'x' | 'y', center?: [string, string]): number => {
    if (!center) return 50
    const value = axis === 'x' ? center[0] : center[1]
    const match = value.match(/^(\d+)%$/)
    return match ? parseInt(match[1]) : 50
  }
  return (
    <div className="config-content">
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : keys ? [keys] : [])}
        className="config-collapse"
      >
        <Collapse.Panel header="数据配置" itemKey="dataset">
          <div className="dataset-editor">
            <ReactDataSheet
              data={(localOption.dataset?.source || []).map((row, rowIndex) => {
                return [{ value: `系列${rowIndex}` }, ...row.map(cell => ({ value: cell }))]
              })}
              valueRenderer={(cell: any) => String(cell?.value ?? '')}
              onCellsChanged={(changes: any) => {
                const originalData = localOption.dataset?.source || []
                const newData = originalData.map(row => [...row])
                if (Array.isArray(changes)) {
                  changes.forEach((change: any) => {
                    const { row, col, value } = change
                    newData[row][col] = value
                  })
                }
                updateConfig({
                  dataset: { source: newData }
                })
              }}
            />
          </div>
        </Collapse.Panel>

        <Collapse.Panel header="基础配置" itemKey="basic">
          <ConfigDescriptions
            data={[
              { key: '显示图例', value: <Switch size="small" checked={!!localOption.legend} onChange={handleLegendChange} /> },
              { key: '显示提示框', value: <Switch size="small" checked={!!localOption.tooltip} onChange={handleTooltipChange} /> },
              ...(localOption.tooltip ? [{
                key: '提示框触发方式',
                value: (
                  <Select
                    value={localOption.tooltip?.trigger || 'axis'}
                    onChange={handleTooltipTriggerChange}
                    style={{ width: '100%' }}
                    clickToHide={true}
                    optionList={[
                      { value: 'axis', label: '坐标轴触发' },
                      { value: 'item', label: '数据项触发' },
                      { value: 'none', label: '不触发' }
                    ]}
                  />
                )
              }] : [])
            ]}
          />
        </Collapse.Panel>

        <Collapse.Panel header="坐标轴配置" itemKey="axis">
          <ConfigDescriptions
            data={[
              {
                key: 'X轴类型',
                value: (
                  <Select
                    value={localOption.xAxis?.type || 'category'}
                    onChange={handleXAxisTypeChange}
                    style={{ width: '100%' }}
                    clickToHide={true}
                    optionList={[
                      { value: 'category', label: '类目轴' },
                      { value: 'value', label: '数值轴' },
                      { value: 'time', label: '时间轴' },
                      { value: 'log', label: '对数轴' }
                    ]}
                  />
                )
              }
            ]}
          />
        </Collapse.Panel>

        <Collapse.Panel header="布局配置" itemKey="layout">
          <ConfigDescriptions
            data={[
              {
                key: 'Grid 顶部位置',
                value: (
                  <SliderInput
                    value={parseInt(localOption.grid?.top || '55')}
                    onChange={handleGridTopChange}
                    min={0}
                    max={100}
                    step={1}
                  />
                )
              }
            ]}
          />
        </Collapse.Panel>

        <Collapse.Panel header="系列配置" itemKey="series">
          <Collapse
            activeKeys={[]}
            onChange={() => { }}
            className="series-collapse"
          >
            {localOption.series?.map((series, index) => (
              <Collapse.Panel key={index} header={`系列 ${index + 1}`} itemKey={`series-${index}`}>
                <ConfigDescriptions
                  data={[
                    {
                      key: '图表类型',
                      value: (
                        <Select
                          value={series.type || 'line'}
                          onChange={(value) => {
                            if (value && typeof value === 'string') {
                              handleSeriesTypeChange(index, value);
                            }
                          }}
                          style={{ width: '100%' }}
                          clickToHide={true}
                          optionList={[
                            { value: 'line', label: '折线图' },
                            { value: 'bar', label: '柱状图' },
                            { value: 'pie', label: '饼图' },
                            { value: 'scatter', label: '散点图' }
                          ]}
                        />
                      )
                    },
                    ...(series.type === 'line' ? [{
                      key: '平滑曲线',
                      value: (
                        <Switch
                          size='small'
                          checked={series.smooth || false}
                          onChange={(checked) => handleSmoothChange(index, checked)}
                        />
                      )
                    }] : []),
                    ...(series.type === 'pie' ? [
                      {
                        key: '饼图半径',
                        value: (
                          <SliderInput
                            value={getPieRadiusValue(series.radius)}
                            onChange={(value) => handlePieRadiusChange(index, value)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        )
                      },
                      {
                        key: '中心位置 X',
                        value: (
                          <SliderInput
                            value={getPieCenterValue('x', series.center)}
                            onChange={(value) => handlePieCenterChange(index, 'x', value)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        )
                      },
                      {
                        key: '中心位置 Y',
                        value: (
                          <SliderInput
                            value={getPieCenterValue('y', series.center)}
                            onChange={(value) => handlePieCenterChange(index, 'y', value)}
                            min={0}
                            max={100}
                            step={1}
                          />
                        )
                      }
                    ] : []),
                    ...(series.type === 'bar' ? [{
                      key: '柱状图配置',
                      value: <div style={{ color: '#999', fontSize: '12px' }}>暂无特殊配置项</div>
                    }] : []),
                    ...(series.type === 'scatter' ? [{
                      key: '散点图配置',
                      value: <div style={{ color: '#999', fontSize: '12px' }}>暂无特殊配置项</div>
                    }] : [])
                  ]}
                />
              </Collapse.Panel>
            ))}
          </Collapse>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ConfigPanel