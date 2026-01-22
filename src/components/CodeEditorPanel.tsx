import React from 'react'
import { Button } from '@douyinfe/semi-ui'
import { IconPlayCircle } from '@douyinfe/semi-icons'
import CodeMirror from '@uiw/react-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import './editor-panel/EditorPanel.css'

interface CodeEditorPanelProps {
  code: string
  onCodeChange: (text: string) => void
  onRun: () => void
}

const CodeEditorPanel: React.FC<CodeEditorPanelProps> = ({ code, onCodeChange, onRun }) => {
  return (
    <div className="editor-content">
      <div className="editor-header">
        <div className="language-selector">JS</div>
        <div className="editor-controls">
          <Button
            theme="solid"
            type="secondary"
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
          onChange={onCodeChange}
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
  )
}

export default CodeEditorPanel