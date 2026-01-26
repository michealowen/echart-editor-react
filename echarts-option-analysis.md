# ECharts Option 与图表关系分析

## 1. 数据与图表的绑定关系

ECharts 通过 `dataset` 配置项实现数据与图表的绑定，支持多种数据组织方式：

### 1.1 数据集绑定

在 `dataset` 中定义数据源，然后通过 `series` 中的 `seriesLayoutBy` 或 `encode` 配置来指定数据如何映射到图表：

```javascript
dataset: {
  source: [
    ['product', '2012', '2013', '2014', '2015', '2016', '2017'],
    ['Milk Tea', 56.5, 82.1, 88.7, 70.1, 53.4, 85.1],
    ['Matcha Latte', 51.1, 51.4, 55.1, 53.3, 73.8, 68.7],
    ['Cheese Cocoa', 40.1, 62.2, 69.5, 36.4, 45.2, 32.5],
    ['Walnut Brownie', 25.2, 37.1, 41.2, 18, 33.9, 49.1]
  ]
}
```

### 1.2 系列与数据绑定

- **折线图**：通过 `seriesLayoutBy: 'row'` 表示按行组织数据，每一行数据对应一个系列
- **饼图**：通过 `encode` 配置明确指定字段映射：
  - `itemName: 'product'`：使用 `product` 字段作为饼图的项名
  - `value: '2012'`：使用 `2012` 字段作为饼图的数值
  - `tooltip: '2012'`：使用 `2012` 字段作为提示框显示的数据

### 1.3 数据映射方式

| 映射方式 | 说明 |
|---------|------|
| `seriesLayoutBy: 'row'` | 按行组织数据，每一行对应一个系列 |
| `seriesLayoutBy: 'column'` | 按列组织数据，每一列对应一个系列 |
| `encode` | 显式指定数据字段与图表元素的映射关系 |
| 直接在 `series` 中定义 `data` | 适用于简单数据场景 |

## 2. 图表位置与坐标轴关系

### 2.1 网格布局

`grid` 配置项用于定义图表的绘图区域，支持多网格布局：

```javascript
grid: { top: '55%' } // 将网格放置在图表顶部55%的位置，用于展示折线图
```

#### 2.1.1 Grid 的核心配置

Grid 是 ECharts 中用于定义图表绘图区域的重要配置项，它决定了坐标轴和数据系列的显示范围。

**Grid 配置参数详解：**

| 配置项 | 类型 | 说明 | 示例 |
|-------|------|------|------|
| `left` | string/number | 左边距 | `left: '10%'` 或 `left: 100` |
| `right` | string/number | 右边距 | `right: '20%'` 或 `right: 80` |
| `top` | string/number | 上边距 | `top: '55%'` 或 `top: 100` |
| `bottom` | string/number | 下边距 | `bottom: '10%'` 或 `bottom: 50` |
| `width` | string/number | 网格宽度 | `width: '50%'` 或 `width: 400` |
| `height` | string/number | 网格高度 | `height: '60%'` 或 `height: 300` |
| `containLabel` | boolean | 是否包含坐标轴标签 | `containLabel: true` |
| `show` | boolean | 是否显示网格边框 | `show: true` |
| `borderColor` | string | 网格边框颜色 | `borderColor: '#ccc'` |
| `backgroundColor` | string | 网格背景色 | `backgroundColor: 'rgba(0,0,0,0.05)'` |

#### 2.1.2 Grid 的定位方式

Grid 支持多种定位方式，可以根据实际需求选择：

**方式一：百分比定位（推荐）**
```javascript
grid: {
  left: '10%',
  right: '20%',
  top: '15%',
  bottom: '10%'
}
```
- 使用百分比可以自适应容器大小
- 适合响应式布局

**方式二：像素定位**
```javascript
grid: {
  left: 50,
  right: 80,
  top: 60,
  bottom: 40
}
```
- 使用固定像素值
- 适合需要精确控制尺寸的场景

**方式三：混合定位**
```javascript
grid: {
  left: '10%',
  right: 80,
  top: 60,
  bottom: '10%'
}
```
- 可以混合使用百分比和像素值

**方式四：简写定位**
```javascript
grid: { top: '55%' } // 只设置上边距，其他使用默认值
```

#### 2.1.3 多网格布局

ECharts 支持多个 grid，实现复杂的图表布局：

```javascript
grid: [
  { left: '7%', top: '7%', width: '38%', height: '38%' },
  { right: '7%', top: '7%', width: '38%', height: '38%' },
  { left: '7%', bottom: '7%', width: '38%', height: '38%' },
  { right: '7%', bottom: '7%', width: '38%', height: '38%' }
]
```

每个 grid 通过 `gridIndex` 关联到对应的坐标轴和系列：

```javascript
xAxis: [
  { gridIndex: 0 }, // 第一个 X 轴属于第一个 grid
  { gridIndex: 1 }  // 第二个 X 轴属于第二个 grid
],
yAxis: [
  { gridIndex: 0 }, // 第一个 Y 轴属于第一个 grid
  { gridIndex: 1 }  // 第二个 Y 轴属于第二个 grid
],
series: [
  { xAxisIndex: 0, yAxisIndex: 0 }, // 使用第一个 X 轴和第一个 Y 轴
  { xAxisIndex: 1, yAxisIndex: 1 }  // 使用第二个 X 轴和第二个 Y 轴
]
```

#### 2.1.4 Grid 与不同图表类型的配合

**示例 1：为右侧饼图留出空间**
```javascript
grid: {
  right: '55%',  // 右侧留出 55% 的空间给饼图
  width: '50%'   // 网格宽度为 50%
}
```
这种配置常用于组合图表，左侧显示折线图/柱状图，右侧显示饼图。

**示例 2：上下分栏布局**
```javascript
grid: {
  top: '55%'  // 网格从顶部 55% 的位置开始，用于下方图表
}
```
这种配置常用于上下分栏，上半部分显示饼图，下半部分显示折线图。

**示例 3：包含坐标轴标签**
```javascript
grid: {
  left: '10%',
  right: '10%',
  containLabel: true  // 自动包含坐标轴标签，防止标签被裁剪
}
```

### 2.2 坐标轴关系

#### 2.2.1 基础坐标轴配置

- **单个坐标轴**：通过 `gridIndex` 指定所属的网格
  ```javascript
  yAxis: { gridIndex: 0 } // 该Y轴属于第一个网格
  ```

- **多个坐标轴**：可以为一个网格配置多个X轴或Y轴，通过 `axisIndex` 关联到系列

- **复合图表**：不同类型的图表可以共享同一网格或使用不同网格，例如：
  - 折线图使用下方网格（通过 `grid` 配置）
  - 饼图使用绝对定位（通过 `center` 和 `radius` 配置）

#### 2.2.2 多坐标轴配置详解

ECharts 支持配置多个 X 轴和 Y 轴，每个轴可以有不同的位置、类型和样式。

**多 X 轴配置示例：**
```javascript
xAxis: [
  {
    type: 'category',
    position: 'top',
    axisTick: { alignWithLabel: true },
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  {
    type: 'category',
    position: 'top',
    offset: 20,  // 第二个 X 轴相对于第一个 X 轴的偏移量
    axisTick: { alignWithLabel: true },
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  }
]
```

**多 Y 轴配置示例：**
```javascript
const colors = ['#5070dd', '#b6d634', '#505372'];

yAxis: [
  {
    type: 'value',
    name: 'Evaporation',
    position: 'right',
    alignTicks: true,  // 对齐刻度
    axisLine: {
      show: true,
      lineStyle: { color: colors[0] }  // 轴线颜色与系列颜色对应
    },
    axisLabel: {
      formatter: '{value} ml'  // 单位格式化
    }
  },
  {
    type: 'value',
    name: 'Precipitation',
    position: 'right',
    alignTicks: true,
    offset: 80,  // 相对于第一个 Y 轴的偏移量
    axisLine: {
      show: true,
      lineStyle: { color: colors[1] }
    },
    axisLabel: {
      formatter: '{value} ml'
    }
  },
  {
    type: 'value',
    name: '温度',
    position: 'left',
    alignTicks: true,
    axisLine: {
      show: true,
      lineStyle: { color: colors[2] }
    },
    axisLabel: {
      formatter: '{value} °C'
    }
  }
]
```

**系列与坐标轴的关联：**
```javascript
series: [
  {
    name: 'Evaporation',
    type: 'bar',
    data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
  },
  {
    name: 'Precipitation',
    type: 'bar',
    yAxisIndex: 1,  // 使用第二个 Y 轴（索引从 0 开始）
    data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
  },
  {
    name: 'Temperature',
    type: 'line',
    yAxisIndex: 2,  // 使用第三个 Y 轴
    data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
  }
]
```

#### 2.2.3 多轴配置的关键参数

| 参数 | 说明 | 示例 |
|------|------|------|
| `xAxisIndex` | 系列使用的 X 轴索引 | `xAxisIndex: 0` |
| `yAxisIndex` | 系列使用的 Y 轴索引 | `yAxisIndex: 1` |
| `gridIndex` | 坐标轴所属的网格索引 | `gridIndex: 0` |
| `position` | 坐标轴位置 | `position: 'right'` 或 `'left'` |
| `offset` | 坐标轴偏移量 | `offset: 80` |
| `alignTicks` | 是否对齐刻度 | `alignTicks: true` |
| `axisLine.lineStyle.color` | 轴线颜色 | `lineStyle: { color: '#5070dd' }` |

#### 2.2.4 多轴配置的最佳实践

1. **颜色对应**：让坐标轴颜色与对应系列的颜色一致，便于区分
2. **单位标注**：在 `axisLabel.formatter` 中添加单位，清晰展示数据含义
3. **刻度对齐**：使用 `alignTicks: true` 对齐多个 Y 轴的刻度，提升可读性
4. **合理偏移**：使用 `offset` 参数避免多个 Y 轴重叠
5. **命名清晰**：为每个坐标轴设置 `name`，明确其代表的含义

### 2.3 定位方式

| 图表类型 | 定位方式 | 示例配置 |
|---------|---------|---------|
| 折线图/柱状图 | 网格布局 | `grid: { top: '55%' }` |
| 饼图 | 绝对定位 | `center: ['50%', '25%'], radius: '30%'` |
| 散点图/热力图 | 网格布局 | `grid: { left: '10%', right: '10%' }` |

## 3. 核心配置项详解

### 3.1 Legend（图例）

**作用**：用于标识不同系列的数据，支持交互操作（如点击切换系列显示/隐藏）

**主要配置**：

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `show` | 是否显示图例 | `show: true` |
| `type` | 图例类型 | `type: 'scroll'`（滚动图例） |
| `orient` | 排列方向 | `orient: 'horizontal'` 或 `'vertical'` |
| `position` | 位置 | `position: 'top'` |
| `data` | 图例数据 | `data: ['系列1', '系列2']` |
| `selected` | 默认选中状态 | `selected: { '系列1': true, '系列2': false }` |

### 3.2 Tooltip（提示框）

**作用**：用于显示鼠标悬停或点击时的数据信息

**主要配置**：

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `trigger` | 触发类型 | `trigger: 'axis'`（坐标轴触发）或 `'item'`（数据项触发） |
| `showContent` | 是否显示提示框内容 | `showContent: true` |
| `triggerOn` | 触发时机 | `triggerOn: 'mousemove'` 或 `'click'` |
| `formatter` | 内容格式器 | `formatter: '{b}: {c}'` |
| `axisPointer` | 坐标轴指示器 | `axisPointer: { type: 'cross' }` |

### 3.3 Grid（网格）

**作用**：定义图表的绘图区域，用于布局坐标轴和数据系列

**主要配置**：

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `show` | 是否显示网格 | `show: false` |
| `left/right/top/bottom` | 网格位置 | `left: '10%', top: '20%'` |
| `width/height` | 网格大小 | `width: '80%', height: '60%'` |
| `containLabel` | 是否包含坐标轴标签 | `containLabel: true` |

### 3.4 坐标轴配置

**X轴（xAxis）和Y轴（yAxis）**：用于定义图表的坐标轴，支持多坐标轴

**主要配置**：

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `type` | 坐标轴类型 | `type: 'category'`（类目轴）或 `'value'`（数值轴）或 `'time'`（时间轴） |
| `name` | 坐标轴名称 | `name: '年份'` |
| `position` | 坐标轴位置 | `position: 'bottom'`（X轴）或 `'left'`（Y轴） |
| `axisLabel` | 坐标轴标签 | `axisLabel: { rotate: 45 }`（旋转45度） |
| `axisLine` | 坐标轴线 | `axisLine: { show: true }` |
| `axisTick` | 坐标轴刻度 | `axisTick: { show: false }` |
| `splitLine` | 分隔线 | `splitLine: { lineStyle: { type: 'dashed' } }` |

### 3.5 Series（系列）

**作用**：定义图表的类型、样式和数据映射关系

**主要配置**：

| 配置项 | 说明 | 示例 |
|-------|------|------|
| `type` | 图表类型 | `type: 'line'`（折线图）或 `'bar'`（柱状图）或 `'pie'`（饼图） |
| `name` | 系列名称 | `name: '2012年销量'` |
| `data` | 系列数据 | 直接指定数据或通过 `dataset` 关联 |
| `smooth` | 平滑曲线（折线图） | `smooth: true` |
| `itemStyle` | 数据项样式 | `itemStyle: { color: '#ff0000' }` |
| `lineStyle` | 线条样式（折线图） | `lineStyle: { width: 2 }` |
| `barWidth` | 柱宽（柱状图） | `barWidth: '50%'` |
| `radius` | 饼图半径 | `radius: '50%'` 或 `radius: ['40%', '70%']`（环形图） |

## 4. 组合图表示例分析

### 4.1 多轴配置示例分析（第一个配置）

这是一个包含多 X 轴、多 Y 轴的组合图表配置，展示了如何在一个图表中同时显示不同量纲的数据。

#### 4.1.1 配置结构

```javascript
const colors = ['#5070dd', '#b6d634', '#505372'];

option = {
  color: colors,
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross' }
  },
  grid: {
    right: '20%'  // 右侧留出 20% 空间给多个 Y 轴
  },
  legend: {
    data: ['Evaporation', 'Precipitation', 'Temperature']
  },
  xAxis: [
    {
      type: 'category',
      position: 'top',
      axisTick: { alignWithLabel: true },
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    },
    {
      type: 'category',
      position: 'top',
      offset: 20,  // 第二个 X 轴偏移 20 像素
      axisTick: { alignWithLabel: true },
      data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  ],
  yAxis: [
    {
      type: 'value',
      name: 'Evaporation',
      position: 'right',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: { color: colors[0] }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: 'Precipitation',
      position: 'right',
      alignTicks: true,
      offset: 80,  // 相对于第一个 Y 轴偏移 80 像素
      axisLine: {
        show: true,
        lineStyle: { color: colors[1] }
      },
      axisLabel: {
        formatter: '{value} ml'
      }
    },
    {
      type: 'value',
      name: '温度',
      position: 'left',
      alignTicks: true,
      axisLine: {
        show: true,
        lineStyle: { color: colors[2] }
      },
      axisLabel: {
        formatter: '{value} °C'
      }
    }
  ],
  series: [
    {
      name: 'Evaporation',
      type: 'bar',
      data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
    },
    {
      name: 'Precipitation',
      type: 'bar',
      yAxisIndex: 1,  // 使用第二个 Y 轴
      data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
    },
    {
      name: 'Temperature',
      type: 'line',
      yAxisIndex: 2,  // 使用第三个 Y 轴
      data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
    }
  ]
};
```

#### 4.1.2 配置要点解析

**1. Grid 配置**
- `right: '20%'`：在右侧留出 20% 的空间，用于放置多个 Y 轴
- 这样可以避免 Y 轴标签与图表内容重叠

**2. 多 X 轴配置**
- 配置了 2 个 X 轴，都位于顶部（`position: 'top'`）
- 第二个 X 轴通过 `offset: 20` 向下偏移 20 像素，避免与第一个 X 轴重叠
- 两个 X 轴使用相同的数据，可以用于显示不同时间粒度或对比数据

**3. 多 Y 轴配置**
- 配置了 3 个 Y 轴：
  - 第一个 Y 轴：显示蒸发量（Evaporation），位于右侧
  - 第二个 Y 轴：显示降水量（Precipitation），位于右侧，偏移 80 像素
  - 第三个 Y 轴：显示温度（Temperature），位于左侧
- 每个 Y 轴都有对应的颜色，与系列颜色一致
- 使用 `alignTicks: true` 对齐刻度，提升可读性
- 使用 `formatter` 添加单位（ml 或 °C）

**4. 系列与坐标轴的关联**
- Evaporation 系列：使用默认的第一个 Y 轴（yAxisIndex: 0）
- Precipitation 系列：使用第二个 Y 轴（yAxisIndex: 1）
- Temperature 系列：使用第三个 Y 轴（yAxisIndex: 2）

**5. 交互设计**
- Tooltip 使用 `trigger: 'axis'` 和 `axisPointer: { type: 'cross' }`，显示十字准星指示器
- Legend 显示所有系列的名称

#### 4.1.3 应用场景

这种多轴配置适用于以下场景：
- 需要在同一图表中显示不同量纲的数据（如体积、温度、重量等）
- 需要对比多个相关指标的变化趋势
- 需要清晰区分不同数据系列

### 4.2 Grid 与饼图组合示例分析（第二个配置）

这是一个使用 Grid 布局和饼图绝对定位的组合图表配置，展示了如何在一个图表中同时显示折线图和饼图。

#### 4.2.1 配置结构

```javascript
option = {
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
  grid: {
    right: '55%',  // 右侧留出 55% 的空间给饼图
    width: '50%'   // 网格宽度为 50%
  },
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
      radius: '10%',
      center: ['70%', '55%'],
      emphasis: { focus: 'self' },
      label: {
        formatter: '{b})'
      },
      encode: {
        itemName: 'product',
        value: '2012',
        tooltip: '2012'
      }
    }
  ]
};
```

#### 4.2.2 配置要点解析

**1. Grid 配置**
- `right: '55%'`：在右侧留出 55% 的空间，用于放置饼图
- `width: '50%'`：网格宽度为 50%，确保折线图在左侧 50% 的区域内显示
- 这种配置实现了左右分栏布局：左侧显示折线图，右侧显示饼图

**2. 坐标轴配置**
- `xAxis: { type: 'category' }`：配置一个类目型 X 轴，默认使用第一个网格
- `yAxis: { gridIndex: 0 }`：配置一个 Y 轴，明确指定使用第一个网格

**3. 数据集配置**
- 使用 `dataset` 定义数据源，包含产品和多年份的销售数据
- 数据以二维数组形式组织，第一行为表头，后续行为数据

**4. 系列配置**
- 前 4 个系列为折线图：
  - 使用 `seriesLayoutBy: 'row'` 按行读取数据，每一行对应一个系列
  - 使用 `smooth: true` 实现平滑曲线
  - 使用 `emphasis: { focus: 'series' }` 实现鼠标悬停时高亮整个系列
- 第 5 个系列为饼图：
  - 使用 `center: ['70%', '55%']` 设置饼图中心位置（右侧 70%，垂直 55%）
  - 使用 `radius: '10%'` 设置饼图半径为 10%
  - 使用 `encode` 配置数据映射：
    - `itemName: 'product'`：使用 product 字段作为饼图的项名
    - `value: '2012'`：使用 2012 字段作为饼图的数值
    - `tooltip: '2012'`：使用 2012 字段作为提示框显示的数据
  - 使用 `emphasis: { focus: 'self' }` 实现鼠标悬停时高亮当前扇区

**5. 交互设计**
- Tooltip 使用 `trigger: 'axis'` 和 `showContent: false`，只显示指示器不显示内容
- Legend 自动生成，显示所有系列的名称

#### 4.2.3 应用场景

这种 Grid 与饼图组合配置适用于以下场景：
- 需要在同一图表中同时展示趋势和占比
- 需要对比多个产品在不同年份的销售情况
- 需要突出显示某一年的数据占比（如 2012 年）

### 4.3 两种配置的对比

| 特性 | 多轴配置 | Grid 与饼图组合配置 |
|------|---------|-------------------|
| 图表类型 | 柱状图 + 折线图 | 折线图 + 饼图 |
| 布局方式 | 单网格，多轴 | 左右分栏，Grid + 绝对定位 |
| 坐标轴数量 | 2 个 X 轴，3 个 Y 轴 | 1 个 X 轴，1 个 Y 轴 |
| 数据组织方式 | 直接在 series 中定义 data | 使用 dataset 统一管理数据 |
| 适用场景 | 不同量纲的数据对比 | 趋势与占比同时展示 |
| 空间利用 | 通过 offset 避免重叠 | 通过 grid 分配空间 |

## 5. 本地项目 defaultOption 分析

以本地项目中的 `defaultOption` 为例，这是一个包含折线图和饼图的组合图表：

### 5.1 布局结构

- **上半部分**：饼图，使用绝对定位 `center: ['50%', '25%'], radius: '30%'`
- **下半部分**：折线图，使用网格布局 `grid: { top: '55%' }`

### 5.2 数据流向

1. `dataset.source` 定义完整数据源
2. 前4个系列（折线图）通过 `seriesLayoutBy: 'row'` 按行读取数据
3. 第5个系列（饼图）通过 `encode` 配置读取特定字段

### 5.3 交互设计

- **Tooltip**：使用 `trigger: 'axis'` 触发，支持坐标轴联动
- **Legend**：默认显示所有系列，支持点击切换
- **Emphasis**：鼠标悬停时高亮显示对应系列

## 6. 总结

ECharts option 是一个结构化的配置对象，通过不同的配置项控制图表的各个方面：

1. **数据层**：通过 `dataset` 或 `series.data` 定义数据
2. **布局层**：通过 `grid`、`center` 等配置控制图表位置
3. **坐标轴层**：通过 `xAxis`、`yAxis` 定义数据尺度
4. **系列层**：通过 `series` 定义图表类型和样式
5. **交互层**：通过 `legend`、`tooltip` 等配置增强用户体验

通过合理配置这些选项，可以创建出各种复杂的交互式图表，满足不同的可视化需求。