import React, { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import './ChartPanel.css'

interface ChartPanelProps {
  option: any
}

const ChartPanel: React.FC<ChartPanelProps> = ({ option }) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartInstance = useRef<echarts.ECharts | null>(null)

  useEffect(() => {
    if (!chartRef.current) return

    const chart = echarts.init(chartRef.current)
    chartInstance.current = chart

    return () => {
      chart.dispose()
    }
  }, [])

  useEffect(() => {
    if (chartInstance.current && option) {
      chartInstance.current.setOption(option, true)
    }
  }, [option])

  useEffect(() => {
    const handleResize = () => {
      chartInstance.current?.resize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="chart-container">
      <div className="chart-title">图表预览</div>
      <div ref={chartRef} className="chart-preview" />
    </div>
  )
}

export default ChartPanel