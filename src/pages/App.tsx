import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, ResizeGroup, ResizeItem, ResizeHandler, Toast } from '@douyinfe/semi-ui'
import ChartPanel from '../components/chart-panel/ChartPanel'
import EditorPanel from '../components/editor-panel/EditorPanel'
import type { EChartsOption } from 'echarts'
import './App.css'



const defaultOption: EChartsOption = {
  legend: {},
  tooltip: {
    trigger: 'axis',
    showContent: true
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
      emphasis: { focus: 'series' },
      encode: {
        x: 0,
        y: 1
      }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' },
      encode: {
        x: 0,
        y: 2
      }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' },
      encode: {
        x: 0,
        y: 3
      }
    },
    {
      type: 'line',
      smooth: true,
      seriesLayoutBy: 'row',
      emphasis: { focus: 'series' },
      encode: {
        x: 0,
        y: 4
      }
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

const MainApp: React.FC = () => {
  const [option, setOption] = useState<EChartsOption>(defaultOption)
  const [code, setCode] = useState<string>(defaultCode)

  // 配置项修改时同步到代码
  useEffect(() => {
    const newCode = `option = ${JSON.stringify(option, null, 2)};`
    setCode(newCode)
  }, [option])

  // 代码修改时解析为配置项
  const handleCodeChange = (newCode: string) => {
    setCode(newCode)
  }

  // 运行代码，更新配置项
  const handleRunCode = () => {
    try {
      const cleanedCode = code.replace(/option\s*=\s*/, '')
      const parsedOption = new Function('return ' + cleanedCode)()
      setOption(parsedOption)
    } catch (error) {
      console.error('解析代码失败:', error)
      Toast.error('解析代码失败，请检查语法是否正确')
    }
  }

  // 配置项修改时直接更新
  const handleConfigChange = (newOption: EChartsOption) => {
    setOption(newOption)
  }

  return (
    <Layout className="app-layout">
      <Layout.Content className="page-main">
        <ResizeGroup direction="horizontal">
          <ResizeItem
            defaultSize="40%"
            style={{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }}
          >
            <EditorPanel
              option={option}
              onConfigChange={handleConfigChange}
              code={code}
              onCodeChange={handleCodeChange}
              onRun={handleRunCode}
            />
          </ResizeItem>
          <ResizeHandler />
          <ResizeItem
            defaultSize="60%"
            style={{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }}
          >
            <ChartPanel option={option} />
          </ResizeItem>
        </ResizeGroup>
      </Layout.Content>
    </Layout>
  )
}

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<MainApp />} />
    </Routes>
  )
}

export default App