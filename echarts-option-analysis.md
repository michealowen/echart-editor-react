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

### 2.2 坐标轴关系

- **单个坐标轴**：通过 `gridIndex` 指定所属的网格
  ```javascript
yAxis: { gridIndex: 0 } // 该Y轴属于第一个网格
  ```

- **多个坐标轴**：可以为一个网格配置多个X轴或Y轴，通过 `axisIndex` 关联到系列

- **复合图表**：不同类型的图表可以共享同一网格或使用不同网格，例如：
  - 折线图使用下方网格（通过 `grid` 配置）
  - 饼图使用绝对定位（通过 `center` 和 `radius` 配置）

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

以本地项目中的 `defaultOption` 为例，这是一个包含折线图和饼图的组合图表：

### 4.1 布局结构

- **上半部分**：饼图，使用绝对定位 `center: ['50%', '25%'], radius: '30%'`
- **下半部分**：折线图，使用网格布局 `grid: { top: '55%' }`

### 4.2 数据流向

1. `dataset.source` 定义完整数据源
2. 前4个系列（折线图）通过 `seriesLayoutBy: 'row'` 按行读取数据
3. 第5个系列（饼图）通过 `encode` 配置读取特定字段

### 4.3 交互设计

- **Tooltip**：使用 `trigger: 'axis'` 触发，支持坐标轴联动
- **Legend**：默认显示所有系列，支持点击切换
- **Emphasis**：鼠标悬停时高亮显示对应系列

## 5. 总结

ECharts option 是一个结构化的配置对象，通过不同的配置项控制图表的各个方面：

1. **数据层**：通过 `dataset` 或 `series.data` 定义数据
2. **布局层**：通过 `grid`、`center` 等配置控制图表位置
3. **坐标轴层**：通过 `xAxis`、`yAxis` 定义数据尺度
4. **系列层**：通过 `series` 定义图表类型和样式
5. **交互层**：通过 `legend`、`tooltip` 等配置增强用户体验

通过合理配置这些选项，可以创建出各种复杂的交互式图表，满足不同的可视化需求。