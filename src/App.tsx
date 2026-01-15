import React, { useState, useEffect } from 'react'
import { Layout } from '@douyinfe/semi-ui'
import EditorPanel from './components/EditorPanel'
import ChartPanel from './components/ChartPanel'
import './App.css'

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

const defaultOption: EChartsOption = {
  legend: {},
  tooltip: {
    trigger: 'axis',
    showContent: false
  },
  dataset: {
    source: [
      ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
      ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
      ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
      ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
      ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
    ]
  },
  xAxis: { type: 'category' },
  yAxis: { gridIndex: 0 },
  grid: { top: '55%' },
  series: [
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' }
    },
    {
      type: 'pie',
      id: 'pie',
      radius: '30%',
      center: ['50%', '25%'],
      emphasis: {
        focus: 'self'
      },
      label: {
        formatter: '{b}: {@2012} ({d}%)'
      },
      encode: {
        itemName: 'product',
        value: '2012',
        tooltip: '2012'
      }
    }
  ]
}

const defaultCode = `option = ${JSON.stringify(defaultOption, null, 2)};`

const App: React.FC = () => {
  const [option, setOption] = useState<EChartsOption>(defaultOption)
  const [code, setCode] = useState<string>(defaultCode)
  const [leftWidth, setLeftWidth] = useState<number>(40)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [dragStartX, setDragStartX] = useState<number>(0)
  const [dragStartWidth, setDragStartWidth] = useState<number>(0)

  const handleRun = () => {
    try {
      const cleanedCode = code.replace(/option\s*=\s*/, '')
      const parsedOption = new Function('return ' + cleanedCode)()
      setOption(parsedOption)
    } catch (error) {
      console.error('解析代码失败:', error)
      alert('解析代码失败，请检查语法是否正确')
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStartX(e.clientX)
    setDragStartWidth(leftWidth)
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return

    const deltaX = e.clientX - dragStartX
    const containerWidth = window.innerWidth
    const newLeftWidth = ((dragStartWidth / 100) * containerWidth + deltaX) / containerWidth * 100

    const clampedWidth = Math.max(20, Math.min(80, newLeftWidth))
    setLeftWidth(clampedWidth)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStartX, dragStartWidth])

  return (
    <Layout className="app-layout">
      <Layout.Content className="page-main">
        <div className="main-container">
          <EditorPanel code={code} setCode={setCode} onRun={handleRun} width={leftWidth} />
          <div
            className="resizer"
            onMouseDown={handleMouseDown}
            style={{ cursor: isDragging ? 'col-resize' : 'col-resize' }}
          />
          <ChartPanel option={option} width={100 - leftWidth} />
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default App
