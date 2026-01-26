import React from 'react'
import { List, Button, Dropdown, Space, Select, Typography } from '@douyinfe/semi-ui'
import { IconMinusCircle, IconPlusCircle, IconSetting } from '@douyinfe/semi-icons'
import ConfigDescriptions from './ConfigDescriptions'
import SliderInput from './SliderInput'

const { Text } = Typography

interface SeriesConfig {
  type?: string
  xAxisIndex?: number
  yAxisIndex?: number
  smooth?: boolean
  radius?: string
  center?: [string, string]
  encode?: {
    itemName?: string
    value?: string
    tooltip?: string
    x?: string
    y?: string
  }
}

interface SeriesManagerProps {
  series: SeriesConfig[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, updates: Partial<SeriesConfig>) => void
  xAxisCount: number
  yAxisCount: number
  dataset?: {
    source: any[][]
  }
}

// Z-index 层级体系
const SERIES_MANAGER_BASE_Z_INDEX = 1100
const SERIES_DROP_DOWN_Z_INDEX = SERIES_MANAGER_BASE_Z_INDEX + 1
const SERIES_CONFIG_SELECT_Z_INDEX = SERIES_DROP_DOWN_Z_INDEX + 1

const SeriesManager: React.FC<SeriesManagerProps> = ({ series, onAdd, onRemove, onUpdate, xAxisCount, yAxisCount, dataset }) => {
  // 生成坐标轴选项
  const generateAxisOptions = (count: number) => {
    return Array.from({ length: count }, (_, i) => ({ value: i, label: `轴 ${i + 1}` }))
  }

  // 获取饼图半径的数值
  const getPieRadiusValue = (radius?: string): number => {
    if (!radius) return 30
    const match = radius.match(/^(\d+)%$/)
    return match ? parseInt(match[1]) : 30
  }

  // 获取饼图中心位置的数值
  const getPieCenterValue = (axis: 'x' | 'y', center?: [string, string]): number => {
    if (!center) return 50
    const value = axis === 'x' ? center[0] : center[1]
    const match = value.match(/^(\d+)%$/)
    return match ? parseInt(match[1]) : 50
  }

  // 处理系列类型变化
  const handleSeriesTypeChange = (index: number, value: string) => {
    onUpdate(index, { type: value })
  }

  // 处理系列X轴索引变化
  const handleSeriesXAxisIndexChange = (index: number, value: number) => {
    onUpdate(index, { xAxisIndex: value })
  }

  // 处理系列Y轴索引变化
  const handleSeriesYAxisIndexChange = (index: number, value: number) => {
    onUpdate(index, { yAxisIndex: value })
  }

  // 处理饼图半径变化
  const handlePieRadiusChange = (index: number, value: number) => {
    onUpdate(index, { radius: `${value}%` })
  }

  // 处理饼图中心位置变化
  const handlePieCenterChange = (index: number, axis: 'x' | 'y', value: number) => {
    const currentCenter = series[index].center || ['50%', '50%']
    const newCenter: [string, string] = axis === 'x'
      ? [`${value}%`, currentCenter[1]]
      : [currentCenter[0], `${value}%`]
    onUpdate(index, { center: newCenter })
  }

  // 处理 X 映射变化
  const handleEncodeXChange = (index: number, value: string | undefined) => {
    onUpdate(index, {
      encode: {
        ...series[index].encode,
        x: value
      }
    })
  }

  // 处理 Y 映射变化
  const handleEncodeYChange = (index: number, value: string | undefined) => {
    onUpdate(index, {
      encode: {
        ...series[index].encode,
        y: value
      }
    })
  }

  // 生成数据列选项
  const generateDataColumnsOptions = () => {
    // 从数据源的每行的第一个元素中获取选项
    if (dataset?.source && dataset.source.length > 0) {
      return dataset.source.map((row, index) => {
        const label = row[0]?.toString() || `行 ${index + 1}`
        return {
          value: index.toString(),
          label: label
        }
      })
    }
    // 如果没有数据源，返回空数组
    return []
  }

  return (
    <div style={{ width: '100%', zIndex: SERIES_MANAGER_BASE_Z_INDEX }}>
      <List
        split={false}
        size='small'
        style={{ borderBottom: '1px solid var(--semi-color-border)', marginBottom: 8 }}
        renderItem={(seriesItem, index) => {
          const renderSeriesConfig = () => (
            <div style={{ padding: 16, width: 300, zIndex: SERIES_DROP_DOWN_Z_INDEX + 1 }}>
              <ConfigDescriptions
                data={[
                  {
                    key: '图表类型',
                    value: (
                      <Select
                        value={seriesItem.type || 'line'}
                        onChange={(value) => handleSeriesTypeChange(index, value as string)}
                        style={{ width: '100%' }}
                        clickToHide={true}
                        zIndex={SERIES_CONFIG_SELECT_Z_INDEX}
                        autoAdjustOverflow={true}
                        optionList={[
                          { value: 'line', label: '折线图' },
                          { value: 'bar', label: '柱状图' },
                          { value: 'pie', label: '饼图' },
                          { value: 'scatter', label: '散点图' }
                        ]}
                      />
                    )
                  },
                  ...(seriesItem.type !== 'pie' ? [{
                    key: '绑定X轴',
                    value: (
                      <Select
                        value={seriesItem.xAxisIndex || 0}
                        onChange={(value) => handleSeriesXAxisIndexChange(index, value as number)}
                        style={{ width: '100%' }}
                        clickToHide={true}
                        zIndex={SERIES_CONFIG_SELECT_Z_INDEX}
                        autoAdjustOverflow={true}
                        optionList={generateAxisOptions(xAxisCount)}
                      />
                    )
                  }] : []),
                  ...(seriesItem.type !== 'pie' ? [{
                    key: '绑定Y轴',
                    value: (
                      <Select
                        value={seriesItem.yAxisIndex || 0}
                        onChange={(value) => handleSeriesYAxisIndexChange(index, value as number)}
                        style={{ width: '100%' }}
                        clickToHide={true}
                        zIndex={SERIES_CONFIG_SELECT_Z_INDEX}
                        autoAdjustOverflow={true}
                        optionList={generateAxisOptions(yAxisCount)}
                      />
                    )
                  }] : []),
                  ...(seriesItem.type !== 'pie' ? [
                    {
                      key: 'X 映射',
                      value: (
                        <Select
                          value={seriesItem.encode?.x}
                          onChange={(value) => handleEncodeXChange(index, value as string)}
                          style={{ width: '100%' }}
                          clickToHide={true}
                          zIndex={SERIES_CONFIG_SELECT_Z_INDEX}
                          autoAdjustOverflow={true}
                          optionList={generateDataColumnsOptions()}
                        />
                      )
                    },
                    {
                      key: 'Y 映射',
                      value: (
                        <Select
                          value={seriesItem.encode?.y}
                          onChange={(value) => handleEncodeYChange(index, value as string)}
                          style={{ width: '100%' }}
                          clickToHide={true}
                          zIndex={SERIES_CONFIG_SELECT_Z_INDEX}
                          autoAdjustOverflow={true}
                          optionList={generateDataColumnsOptions()}
                        />
                      )
                    }
                  ] : []),
                  ...(seriesItem.type === 'pie' ? [
                    {
                      key: '饼图半径',
                      value: (
                        <SliderInput
                          value={getPieRadiusValue(seriesItem.radius)}
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
                          value={getPieCenterValue('x', seriesItem.center)}
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
                          value={getPieCenterValue('y', seriesItem.center)}
                          onChange={(value) => handlePieCenterChange(index, 'y', value)}
                          min={0}
                          max={100}
                          step={1}
                        />
                      )
                    }
                  ] : []),
                  ...(seriesItem.type === 'bar' ? [{
                    key: '柱状图配置',
                    value: <div style={{ color: '#999', fontSize: '12px' }}>暂无特殊配置项</div>
                  }] : []),
                  ...(seriesItem.type === 'scatter' ? [{
                    key: '散点图配置',
                    value: <div style={{ color: '#999', fontSize: '12px' }}>暂无特殊配置项</div>
                  }] : [])
                ]}
              />
            </div>
          )

          return (
            <div style={{ margin: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space style={{ alignItems: 'center' }}>
                <Button type='danger' theme='borderless' icon={<IconMinusCircle />} onClick={() => onRemove(index)} style={{ marginRight: 8 }} />
                <span>系列-{index + 1}</span>
                {seriesItem.type && <Text ellipsis style={{ maxWidth: '100px' }}>
                  {seriesItem.type === 'line' ? '折线图' :
                    seriesItem.type === 'bar' ? '柱状图' :
                      seriesItem.type === 'pie' ? '饼图' : '散点图'}
                </Text>}
              </Space>

              <Dropdown
                trigger={'click'}
                zIndex={SERIES_DROP_DOWN_Z_INDEX}
                autoAdjustOverflow={true}
                position="right"
                render={
                  <Dropdown.Menu>{renderSeriesConfig()}</Dropdown.Menu>
                }>
                <Button key={`series-config-${index}`} theme='borderless' icon={<IconSetting />} >
                  配置
                </Button>
              </Dropdown>
            </div>
          )
        }}
        dataSource={series}
      />
      <div style={{ margin: 4, fontSize: 14 }}>
        <Button theme='borderless' icon={<IconPlusCircle />} onClick={onAdd} style={{ marginRight: 4, color: 'var(--semi-color-info)' }}>
        </Button>
        新增系列
      </div>
    </div>
  )
}

export default SeriesManager