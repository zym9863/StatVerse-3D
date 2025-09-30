[English](./README_EN.md) | 简体中文

# StatVerse 3D

一个基于 Three.js 的 3D 统计学可视化工具，用于展示置信区间和参数估计的交互式三维图形。

## 功能特性

- 🎨 3D 可视化统计学概念
- 📊 置信区间交互式展示
- 📈 参数估计可视化
- 🎮 实时交互控制
- 🔧 基于 dat.GUI 的参数调节
- 📱 PWA 支持 - 可安装、离线使用

## 技术栈

- **Three.js** - 3D 图形渲染
- **TypeScript** - 类型安全的开发
- **Vite** - 快速的构建工具
- **dat.GUI** - 参数控制界面
- **PWA** - 渐进式 Web 应用支持

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

# 生成 PWA 图标
pnpm generate-icons
```

## PWA 支持

本项目支持作为 PWA (渐进式 Web 应用) 运行:

- ✅ 可安装到桌面/主屏幕
- ✅ 离线访问支持
- ✅ 自动更新缓存
- ✅ 跨平台支持 (Windows、macOS、Linux、iOS、Android)

### 首次配置

1. 安装 Python 依赖:
```bash
pip install Pillow
```

2. 生成应用图标:
```bash
python generate_icons.py
```

详细的 PWA 配置说明请查看 [PWA_SETUP.md](./PWA_SETUP.md)。

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