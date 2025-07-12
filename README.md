[English](./README_EN.md) | 简体中文

# StatVerse 3D

一个基于 Three.js 的 3D 统计学可视化工具，用于展示置信区间和参数估计的交互式三维图形。

## 功能特性

- 🎨 3D 可视化统计学概念
- 📊 置信区间交互式展示
- 📈 参数估计可视化
- 🎮 实时交互控制
- 🔧 基于 dat.GUI 的参数调节

## 技术栈

- **Three.js** - 3D 图形渲染
- **TypeScript** - 类型安全的开发
- **Vite** - 快速的构建工具
- **dat.GUI** - 参数控制界面

## 安装

```bash
# 使用 pnpm 安装依赖
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

## 开发

```bash
# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview
```

## 项目结构

```
StatVerse 3D/
├── src/
│   ├── main.ts                    # 应用入口
│   ├── scene/
│   │   └── SceneManager.ts        # 3D 场景管理
│   ├── statistics/
│   │   └── Distribution.ts        # 统计分布
│   ├── visualizers/
│   │   ├── ConfidenceIntervalVisualizer.ts    # 置信区间可视化
│   │   └── ParameterEstimationVisualizer.ts   # 参数估计可视化
│   └── ui/
│       └── UIController.ts        # UI 控制器
├── public/                        # 静态资源
├── index.html                     # HTML 入口
└── package.json                   # 项目配置
```

## 许可证

MIT