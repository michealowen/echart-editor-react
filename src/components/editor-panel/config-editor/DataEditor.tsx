import React, { useCallback, useState } from 'react'
import { Spreadsheet } from 'react-spreadsheet'
import { InputNumber, Button, Space, Typography } from '@douyinfe/semi-ui'
import './ConfigPanel.css'

interface DataEditorProps {
  data: any[][]
  onChange: (data: any[][]) => void
}

const DataEditor: React.FC<DataEditorProps> = ({ data, onChange }) => {
  const [rows, setRows] = useState<number>(data.length || 1)
  const [columns, setColumns] = useState<number>(data[0]?.length || 1)

  // 使用 useCallback 缓存回调函数，避免每次渲染都创建新的函数引用
  const handleSpreadsheetChange = useCallback((spreadsheetData: any) => {
    console.log(spreadsheetData)
    // FIXME: https://github.com/iddan/react-spreadsheet
    // 会多拷贝一行数据, 因此需要忽略 undefined 的 row
    const newData = []
    for (const row of spreadsheetData) {
      // 忽略存在 undefined 的 row
      if (row.some((cell: any) => cell === undefined))
        continue
      newData.push(row.map((cell: any) => cell?.value ?? ''))
    }
    console.log('newData', newData)
    onChange(newData)
  }, [onChange]) // 依赖项只包含 onChange

  // 处理行数变化
  const handleRowsChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    if (!isNaN(numValue) && numValue > 0) {
      setRows(numValue)
    }
  }

  // 处理列数变化
  const handleColumnsChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    if (!isNaN(numValue) && numValue > 0) {
      setColumns(numValue)
    }
  }

  // 调整表格尺寸
  const handleResizeTable = () => {
    // 清空当前数据并创建新的表格结构
    const newData: any[][] = []
    for (let i = 0; i < rows; i++) {
      const row: any[] = []
      for (let j = 0; j < columns; j++) {
        row.push('')
      }
      newData.push(row)
    }
    onChange(newData)
  }

  return (
    <div className="dataset-editor" style={{ width: 600, padding: 10 }}>
      <div style={{ maxHeight: 400, overflow: 'auto', marginBottom: 16 }}>
        <Spreadsheet
          data={data}
          onChange={handleSpreadsheetChange}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Space style={{ minWidth: 120 }}>
          <Typography.Text>行数</Typography.Text>
          <InputNumber
            value={rows}
            onChange={handleRowsChange}
            min={1}
            precision={0}
            style={{ width: 100 }}
          />
        </Space>
        <Space style={{ minWidth: 120 }}>
          <Typography.Text>列数</Typography.Text>
          <InputNumber
            value={columns}
            onChange={handleColumnsChange}
            min={1}
            precision={0}
            style={{ width: 100 }}
          />
        </Space>
        <Button type="primary" onClick={handleResizeTable}>
          重置数据
        </Button>
      </div>
    </div>
  )
}

export default DataEditor