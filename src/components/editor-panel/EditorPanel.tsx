import React, { useState } from 'react'
import { Tabs } from '@douyinfe/semi-ui'
import ConfigPanel from '../ConfigPanel'
import CodeEditorPanel from '../CodeEditorPanel'
import './EditorPanel.css'

interface EditorPanelProps {
  option: any
  onConfigChange: (option: any) => void
  code: string
  onCodeChange: (code: string) => void
  onRun: () => void
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  option,
  onConfigChange,
  code,
  onCodeChange,
  onRun
}) => {
  const [activeTab, setActiveTab] = useState('config')

  return (
    <div className="editor-left-container">
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        type="line"
        className="editor-tabs"
      >
        <Tabs.TabPane tab="配置项" itemKey="config">
          <ConfigPanel option={option} onChange={onConfigChange} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="代码编辑" itemKey="code">
          <CodeEditorPanel code={code} onCodeChange={onCodeChange} onRun={onRun} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}

export default EditorPanel