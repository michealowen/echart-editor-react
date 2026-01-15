import React, { useState } from 'react'
import { Button, Tabs, Select, Switch } from '@douyinfe/semi-ui'
import { IconPlayCircle } from '@douyinfe/semi-icons'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import './EditorPanel.css'

interface EditorPanelProps {
  code: string
  setCode: (text: string) => void
  onRun: () => void
  width: number
}

const EditorPanel: React.FC<EditorPanelProps> = ({ code, setCode, onRun, width }) => {
  const [activeTab, setActiveTab] = useState('code')

  return (
    <div className="editor-left-container" style={{ width: `${width}%` }}>
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as string)}
        type="line"
        className="editor-tabs"
      >
        <Tabs.TabPane tab="代码编辑" itemKey="code">
          <div className="editor-content">
            <div className="editor-header">
              <div className="language-selector">JS</div>
              <div className="editor-controls">
                <Button
                  theme="solid"
                  type="primary"
                  icon={<IconPlayCircle />}
                  size="small"
                  onClick={onRun}
                >
                  运行
                </Button>
              </div>
            </div>
            <div className="code-editor">
              <CodeMirror
                value={code}
                style={{ height: '100%' }}
                extensions={[javascript()]}
                theme={oneDark}
                onChange={(value) => setCode(value)}
                basicSetup={{
                  lineNumbers: true,
                  highlightActiveLineGutter: true,
                  highlightSpecialChars: true,
                  foldGutter: true,
                  drawSelection: true,
                  dropCursor: true,
                  allowMultipleSelections: true,
                  indentOnInput: true
                }}
              />
            </div>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane tab="配置项" itemKey="config">
          <div className="config-content">
            <div className="config-item">
              <label>图表类型</label>
              <Select
                placeholder="选择图表类型"
                style={{ width: '100%' }}
                optionList={[
                  { value: 'line', label: '折线图' },
                  { value: 'bar', label: '柱状图' },
                  { value: 'pie', label: '饼图' },
                  { value: 'scatter', label: '散点图' }
                ]}
              />
            </div>
            <div className="config-item">
              <label>启用动画</label>
              <Switch defaultChecked />
            </div>
            <div className="config-item">
              <label>显示图例</label>
              <Switch defaultChecked />
            </div>
            <div className="config-item">
              <label>显示提示框</label>
              <Switch defaultChecked />
            </div>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default EditorPanel
