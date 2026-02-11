import React from 'react'
import { List, Button, Dropdown, Space, Select, Input, InputNumber, Typography } from '@douyinfe/semi-ui'
import { IconMinusCircle, IconPlusCircle, IconSetting } from '@douyinfe/semi-icons'
import ConfigDescriptions from './ConfigDescriptions'

const { Text } = Typography

type AxisType = 'value' | 'category' | 'time' | 'log'

type XAxisPosition = 'bottom' | 'top'
type YAxisPosition = 'left' | 'right'

interface AxisConfig {
  type?: AxisType
  name?: string
  position?: XAxisPosition | YAxisPosition
  offset?: number
  gridIndex?: number
  min?: number | 'dataMin'
  axisLine?: {
    show?: boolean
    lineStyle?: {
      color?: string
    }
  }
}

interface AxisManagerProps {
  type: 'x' | 'y'
  axes: AxisConfig[]
  onAdd: () => void
  onRemove: (index: number) => void
  onUpdate: (index: number, updates: Partial<AxisConfig>) => void
}
// Z-index 层级体系
const AXIS_MANAGER_BASE_Z_INDEX = 1000
const AXIS_DROP_DOWN_Z_INDEX = AXIS_MANAGER_BASE_Z_INDEX + 1
const AXIS_CONFIG_SELECT_Z_INDEX = AXIS_DROP_DOWN_Z_INDEX + 1

const AxisManager: React.FC<AxisManagerProps> = ({ type, axes, onAdd, onRemove, onUpdate }) => {
  const handleTypeChange = (index: number, value: string | number | any[] | Record<string, any> | undefined) => {
    if (value !== undefined && typeof value === 'string') {
      onUpdate(index, { type: value as AxisType })
    }
  }

  const handleNameChange = (index: number, value: string) => {
    onUpdate(index, { name: value })
  }

  const handlePositionChange = (index: number, value: string | number | any[] | Record<string, any> | undefined) => {
    if (value !== undefined && typeof value === 'string') {
      onUpdate(index, { position: value as XAxisPosition | YAxisPosition })
    }
  }

  const handleOffsetChange = (index: number, value: number | string | undefined) => {
    if (typeof value === 'number') {
      onUpdate(index, { offset: value })
    }
  }

  const handleMinChange = (index: number, value: number | string | undefined) => {
    if (value === undefined || value === '') {
      onUpdate(index, { min: undefined })
      return
    }
    if (typeof value === 'string') {
      const numValue = parseFloat(value)
      if (!isNaN(numValue)) {
        onUpdate(index, { min: numValue })
      } else if (value === 'dataMin') {
        onUpdate(index, { min: 'dataMin' })
      }
    } else if (typeof value === 'number') {
      onUpdate(index, { min: value })
    }
  }

  const handleGridIndexChange = (index: number, value: number | string | undefined) => {
    if (typeof value === 'number') {
      onUpdate(index, { gridIndex: value })
    }
  }

  const handleColorChange = (index: number, value: string) => {
    onUpdate(index, {
      axisLine: {
        show: true,
        lineStyle: {
          color: value
        }
      }
    })
  }

  const renderPositionOptions = () => {
    if (type === 'x') {
      return [
        { value: 'bottom', label: '底部' },
        { value: 'top', label: '顶部' }
      ]
    } else {
      return [
        { value: 'left', label: '左侧' },
        { value: 'right', label: '右侧' }
      ]
    }
  }

  return (
    <div style={{ width: '100%', zIndex: AXIS_MANAGER_BASE_Z_INDEX }}>
      <List
        split={false}
        size='small'
        style={{ borderBottom: '1px solid var(--semi-color-border)', marginBottom: 8 }}
        renderItem={(axis, index) => {
          const renderAxisConfig = () => (
            <div style={{ padding: 16, width: 300, zIndex: AXIS_DROP_DOWN_Z_INDEX + 1 }}>
              <ConfigDescriptions
                data={[
                  {
                    key: '类型', value: (
                      <Select
                        value={axis.type || (type === 'x' ? 'category' : 'value')}
                        onChange={(value) => handleTypeChange(index, value)}
                        style={{ width: '100%' }}
                        clickToHide={true}
                        zIndex={AXIS_CONFIG_SELECT_Z_INDEX}
                        autoAdjustOverflow={true}
                        optionList={[
                          { value: 'category', label: '类目轴' },
                          { value: 'value', label: '数值轴' },
                          { value: 'time', label: '时间轴' },
                          { value: 'log', label: '对数轴' }
                        ]}
                      />
                    )
                  },
                  { key: '名称', value: <Input size="small" value={axis.name} onChange={(value) => handleNameChange(index, value)} placeholder="输入轴名称" /> },
                  {
                    key: '位置', value: (
                      <Select
                        value={axis.position || (type === 'x' ? 'bottom' : 'left')}
                        onChange={(value) => handlePositionChange(index, value)}
                        style={{ width: '100%' }}
                        clickToHide={true}
                        zIndex={AXIS_CONFIG_SELECT_Z_INDEX}
                        autoAdjustOverflow={true}
                        optionList={renderPositionOptions()}
                      >
                      </Select>
                    )
                  },
                  { key: '偏移量', value: <InputNumber size="small" value={axis.offset || 0} onChange={(value) => handleOffsetChange(index, value)} min={0} /> },
                  { key: '最小刻度', value: <InputNumber size="small" value={typeof axis.min === 'number' ? axis.min : undefined} onChange={(value) => handleMinChange(index, value?.toString() || '')} placeholder="输入最小刻度" /> },
                  { key: '网格索引', value: <InputNumber size="small" value={axis.gridIndex || 0} onChange={(value) => handleGridIndexChange(index, value)} min={0} /> },
                  { key: '颜色', value: <Input size="small" value={axis.axisLine?.lineStyle?.color || '#333'} onChange={(value) => handleColorChange(index, value)} placeholder="输入颜色值" /> }
                ]}
              />
            </div>
          )

          return (
            <div style={{ margin: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Space style={{ alignItems: 'center' }}>
                <Button type='danger' theme='borderless' icon={<IconMinusCircle />} onClick={() => onRemove(index)} style={{ marginRight: 8 }} />
                <span>{type.toUpperCase()}轴-{index + 1}</span>
                {axis.name && <Text ellipsis style={{ maxWidth: '100px' }}>
                  {axis.name}
                </Text>}
              </Space>

              <Dropdown
                trigger={'click'}
                zIndex={AXIS_DROP_DOWN_Z_INDEX}
                autoAdjustOverflow={true}
                render={
                  <Dropdown.Menu>{renderAxisConfig()}</Dropdown.Menu>
                }>
                <Button key={`${type}-axis-config-${index}`} theme='borderless' icon={<IconSetting />} >
                  配置
                </Button>
              </Dropdown>
            </div>
          )
        }}
        dataSource={axes}
      />
      <div style={{ margin: 4, fontSize: 14 }}>
        <Button theme='borderless' icon={<IconPlusCircle />} onClick={onAdd} style={{ marginRight: 4, color: 'var(--semi-color-info)' }}>
        </Button>
        新增{type.toUpperCase()}轴
      </div>
    </div>
  )
}

export default AxisManager
