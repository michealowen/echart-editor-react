import React, { useState, useEffect, useMemo, useRef } from 'react'
import { Switch, Collapse, Popover } from '@douyinfe/semi-ui'
import { IconSetting } from '@douyinfe/semi-icons'
import ConfigDescriptions from './ConfigDescriptions'
import AxisManager from './AxisManager'
import SeriesManager from './SeriesManager'
import DataEditor from './DataEditor'
import SliderInput from './SliderInput'
import './ConfigPanel.css'

interface AxisConfig {
  type?: string
  name?: string
  position?: string
  offset?: number
  alignTicks?: boolean
  gridIndex?: number
  axisLine?: {
    show?: boolean
    lineStyle?: {
      color?: string
    }
  }
  axisLabel?: {
    formatter?: string
  }
}

interface EChartsOption {
  legend?: {
    bottom?: string
    autoPosition?: boolean
  }
  tooltip?: {
    trigger?: string
    showContent?: boolean
  }
  dataset?: {
    source: any[][]
  }
  xAxis?: AxisConfig | AxisConfig[]
  yAxis?: AxisConfig | AxisConfig[]
  grid?: {
    top?: string
    right?: string
    left?: string
    width?: string
    height?: string
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
    xAxisIndex?: number
    yAxisIndex?: number
  }>
}

interface ConfigPanelProps {
  option: EChartsOption
  onChange: (option: EChartsOption) => void
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ option, onChange }) => {
  const [localOption, setLocalOption] = useState<EChartsOption>(option)
  const [activeKeys, setActiveKeys] = useState<string[]>([])

  // 使用 useMemo 缓存 spreadsheetData 的计算结果
  const spreadsheetData = useMemo(() => {
    return (option.dataset?.source || []).map((row: any[]) => {
      return row.map(cell => ({ value: cell }))
    })
  }, [option.dataset?.source])

  // 防抖定时器引用
  const debounceTimerRef = useRef<number | null>(null)

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

  // 防抖处理的数据集更新函数
  const debouncedUpdateDataset = (newData: any[][]) => {
    // 清除之前的定时器
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // 设置新的定时器
    debounceTimerRef.current = setTimeout(() => {
      updateConfig({
        dataset: { source: newData }
      })
    }, 300) // 300ms 的防抖延迟
  }

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // 确保坐标轴是数组格式
  const ensureAxesAsArray = () => {
    let xAxis = localOption.xAxis
    let yAxis = localOption.yAxis

    if (xAxis && !Array.isArray(xAxis)) {
      xAxis = [xAxis]
    }
    if (yAxis && !Array.isArray(yAxis)) {
      yAxis = [yAxis]
    }
    if (!xAxis) {
      xAxis = [{ type: 'category', alignTicks: true }]
    }
    if (!yAxis) {
      yAxis = [{ type: 'value', alignTicks: true }]
    }

    return { xAxis, yAxis }
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
        showContent: true
      } : undefined
    })
  }

  // 更新图例底部位置
  const handleLegendBottomChange = (value: number) => {
    updateConfig({
      legend: {
        ...(localOption.legend || {}),
        bottom: `${value}%`
      }
    })
  }



  // 更新图例自动位置
  const handleLegendAutoPositionChange = (checked: boolean) => {
    updateConfig({
      legend: {
        ...(localOption.legend || {}),
        autoPosition: checked
      }
    })
  }

  // 添加X轴
  const addXAxis = () => {
    const { xAxis } = ensureAxesAsArray()
    xAxis.push({ type: 'category', alignTicks: true })
    updateConfig({ xAxis })
  }

  // 添加Y轴
  const addYAxis = () => {
    const { yAxis } = ensureAxesAsArray()
    yAxis.push({ type: 'value', alignTicks: true })
    updateConfig({ yAxis })
  }

  // 删除X轴
  const removeXAxis = (index: number) => {
    const { xAxis } = ensureAxesAsArray()
    if (xAxis.length > 1) {
      xAxis.splice(index, 1)
      updateConfig({ xAxis })
    }
  }

  // 删除Y轴
  const removeYAxis = (index: number) => {
    const { yAxis } = ensureAxesAsArray()
    if (yAxis.length > 1) {
      yAxis.splice(index, 1)
      updateConfig({ yAxis })
    }
  }

  // 添加系列
  const addSeries = () => {
    const series = localOption.series || []
    series.push({ type: 'line' })
    updateConfig({ series })
  }

  // 删除系列
  const removeSeries = (index: number) => {
    const series = localOption.series || []
    series.splice(index, 1)
    updateConfig({ series })
  }

  // 更新系列
  const updateSeries = (index: number, updates: any) => {
    const series = localOption.series || []
    series[index] = { ...series[index], ...updates }
    updateConfig({ series })
  }

  // 更新Grid顶部位置
  const handleGridTopChange = (value: number) => {
    updateConfig({
      grid: {
        ...(localOption.grid || {}),
        top: `${value}%`
      }
    })
  }

  // 更新Grid左侧位置
  const handleGridLeftChange = (value: number) => {
    updateConfig({
      grid: {
        ...(localOption.grid || {}),
        left: `${value}%`
      }
    })
  }

  // 更新Grid宽度
  const handleGridWidthChange = (value: number) => {
    updateConfig({
      grid: {
        ...(localOption.grid || {}),
        width: `${value}%`
      }
    })
  }

  // 更新Grid高度
  const handleGridHeightChange = (value: number) => {
    updateConfig({
      grid: {
        ...(localOption.grid || {}),
        height: `${value}%`
      }
    })
  }
















  // 获取坐标轴数组
  const getXAxes = (): AxisConfig[] => {
    const { xAxis } = ensureAxesAsArray()
    return xAxis
  }

  // 获取坐标轴数组
  const getYAxes = (): AxisConfig[] => {
    const { yAxis } = ensureAxesAsArray()
    return yAxis
  }



  return (
    <div className="config-content">
      <Collapse
        activeKey={activeKeys}
        onChange={(keys) => setActiveKeys(Array.isArray(keys) ? keys : keys ? [keys] : [])}
      >
        <Collapse.Panel
          itemKey="dataset"
          showArrow={false}
          header="数据配置"
          extra={
            <Popover
              content={
                <DataEditor
                  data={spreadsheetData}
                  onChange={debouncedUpdateDataset}
                />
              }
              trigger="click"
            >
              <span style={{ cursor: 'pointer' }}>
                <IconSetting />
              </span>
            </Popover>
          }
        >
          {/* 这里留空，因为数据配置通过 Popover 展示 */}
        </Collapse.Panel>

        <Collapse.Panel header="基础配置" itemKey="basic">
          <ConfigDescriptions
            data={[
              { key: '显示图例', value: <Switch size="small" checked={!!localOption.legend} onChange={handleLegendChange} /> },
              ...(localOption.legend ? [
                {
                  key: '自动位置',
                  value: <Switch size="small" checked={!!localOption.legend?.autoPosition} onChange={handleLegendAutoPositionChange} />
                },
                ...(!localOption.legend?.autoPosition ? [
                  {
                    key: '图例底部位置',
                    value: (
                      <SliderInput
                        value={parseInt(localOption.legend?.bottom || '0')}
                        onChange={handleLegendBottomChange}
                        min={0}
                        max={100}
                        step={1}
                      />
                    )
                  }
                ] : [])
              ] : []),
              { key: '显示提示框', value: <Switch size="small" checked={!!localOption.tooltip} onChange={handleTooltipChange} /> }
            ]}
          />
        </Collapse.Panel>

        <Collapse.Panel header="坐标轴配置" itemKey="axis">
          <Collapse className="axis-collapse">
            <Collapse.Panel header="X轴管理" itemKey="x-axis-management">
              <AxisManager
                type="x"
                axes={getXAxes()}
                onAdd={addXAxis}
                onRemove={removeXAxis}
                onUpdate={(index, updates) => {
                  const { xAxis } = ensureAxesAsArray()
                  xAxis[index] = { ...xAxis[index], ...updates }
                  updateConfig({ xAxis })
                }}
              />
            </Collapse.Panel>

            <Collapse.Panel header="Y轴管理" itemKey="y-axis-management">
              <AxisManager
                type="y"
                axes={getYAxes()}
                onAdd={addYAxis}
                onRemove={removeYAxis}
                onUpdate={(index, updates) => {
                  const { yAxis } = ensureAxesAsArray()
                  yAxis[index] = { ...yAxis[index], ...updates }
                  updateConfig({ yAxis })
                }}
              />
            </Collapse.Panel>
          </Collapse>
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
              },
              {
                key: 'Grid 左侧位置',
                value: (
                  <SliderInput
                    value={parseInt(localOption.grid?.left || '30')}
                    onChange={handleGridLeftChange}
                    min={0}
                    max={100}
                    step={1}
                  />
                )
              },
              {
                key: 'Grid 宽度',
                value: (
                  <SliderInput
                    value={parseInt(localOption.grid?.width || '40')}
                    onChange={handleGridWidthChange}
                    min={0}
                    max={100}
                    step={1}
                  />
                )
              },
              {
                key: 'Grid 高度',
                value: (
                  <SliderInput
                    value={parseInt(localOption.grid?.height || '30')}
                    onChange={handleGridHeightChange}
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
          <SeriesManager
            series={localOption.series || []}
            onAdd={addSeries}
            onRemove={removeSeries}
            onUpdate={updateSeries}
            xAxisCount={getXAxes().length}
            yAxisCount={getYAxes().length}
            dataset={localOption.dataset}
          />
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}

export default ConfigPanel