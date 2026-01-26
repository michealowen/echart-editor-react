import React from 'react'
import { Descriptions } from '@douyinfe/semi-ui'

interface ConfigDescriptionsProps {
  data: Array<{ key: string; value: React.ReactNode }>
}

const ConfigDescriptions: React.FC<ConfigDescriptionsProps> = ({ data }) => {
  return (
    <Descriptions
      align="left"
      className="config-descriptions"
      data={data}
    />
  )
}

export default ConfigDescriptions
