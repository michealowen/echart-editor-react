## 实现 ECharts Example 页面

### 技术栈
- TypeScript
- React
- Semi Design (semi-ui)
- ECharts
- pnpm (包管理)

### 实现步骤：

1. **初始化项目**
   - 创建 React + TypeScript 项目结构
   - 配置 pnpm 作为包管理器
   - 设置基础配置文件（package.json, tsconfig.json）

2. **安装依赖**
   - react, react-dom
   - @types/react, @types/react-dom
   - semi-ui (dumi/theme, @douyinfe/semi-ui)
   - echarts
   - vite (构建工具)

3. **创建项目结构**
   ```
   src/
     ├── components/
     │   ├── EditorPanel.tsx      # 左侧编辑器面板
     │   ├── ChartPanel.tsx       # 右侧图表面板
     │   └── Navbar.tsx          # 顶部导航栏
     ├── App.tsx                 # 主应用组件
     ├── main.tsx                # 入口文件
     └── example.html             # HTML 入口文件
   ```

4. **实现 UI 组件**
   - **Navbar**: 复现顶部导航栏（50px 高度）
   - **EditorPanel**: 左侧编辑器面板（40% 宽度）
     - 标签页导航（代码编辑、完整代码、配置项）
     - 语言切换（JS/TS）
     - 工具按钮（CodePen、CodeSandbox、格式化、运行）
     - 代码编辑器区域
   - **ChartPanel**: 右侧图表预览面板（60% 宽度）
     - 图表标题
     - ECharts 图表展示区域

5. **样式复现**
   - 使用 Semi Design 组件库
   - 复现原页面的布局和样式
   - 左右分栏布局
   - 正确的配色方案
   - 响应式设计

6. **集成 ECharts**
   - 在 ChartPanel 中初始化 ECharts 实例
   - 使用 dataset-link 示例数据
   - 渲染折线图

7. **配置路由**
   - 创建 example.html 作为入口
   - 配置 Vite 开发服务器
   - 设置端口和路由

8. **启动项目**
   - 使用 pnpm 安装依赖
   - 使用 pnpm dev 启动开发服务器
   - 访问 http://localhost:port/example.html

### 注意事项：
- 仅实现 UI 样式，不要求交互功能
- 样式尽量贴合原页面
- 使用 TypeScript 严格模式
- 代码注释使用中文