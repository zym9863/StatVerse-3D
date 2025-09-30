# PWA 快速参考

## 📋 已创建的文件

```
StatVerse-3D/
├── generate_icons.py          # Python 图标生成脚本
├── requirements.txt            # Python 依赖
├── PWA_SETUP.md               # PWA 详细配置文档
├── public/
│   ├── manifest.json          # PWA 应用清单
│   ├── sw.js                  # Service Worker
│   └── icons/                 # 生成的图标 (8个尺寸)
│       ├── icon-72x72.png
│       ├── icon-96x96.png
│       ├── icon-128x128.png
│       ├── icon-144x144.png
│       ├── icon-152x152.png
│       ├── icon-192x192.png
│       ├── icon-384x384.png
│       └── icon-512x512.png
└── index.html                 # 已更新(添加 PWA meta 标签)
```

## 🚀 快速开始

### 1️⃣ 已完成的设置
- ✅ manifest.json 已配置
- ✅ Service Worker 已创建
- ✅ HTML 已更新支持 PWA
- ✅ 8个尺寸的图标已生成

### 2️⃣ 如何使用

**开发模式:**
```bash
npm run dev
```

**构建部署:**
```bash
npm run build
```

**重新生成图标:**
```bash
npm run generate-icons
```

## 🔍 测试 PWA

### Chrome DevTools
1. 按 F12 打开开发者工具
2. 点击 "Application" 标签
3. 查看:
   - **Manifest**: 检查应用清单
   - **Service Workers**: 查看 SW 状态
   - **Storage**: 查看缓存内容

### 安装应用
1. 在浏览器地址栏看到安装图标 ⊕
2. 点击安装
3. 应用将添加到桌面/主屏幕

## ⚙️ 自定义配置

### 修改应用名称/颜色
编辑 `public/manifest.json`:
```json
{
  "name": "你的应用名称",
  "short_name": "短名称",
  "theme_color": "#你的颜色"
}
```

### 调整缓存策略
编辑 `public/sw.js` 的 `urlsToCache` 数组

### 更新图标
替换 `icon.png` 后运行:
```bash
python generate_icons.py
```

## 📱 部署检查清单

- [ ] 图标已生成
- [ ] manifest.json 配置完成
- [ ] 使用 HTTPS (或 localhost 测试)
- [ ] Service Worker 注册成功
- [ ] 在 Chrome DevTools 中验证

## 🌐 推荐部署平台

- **Vercel** - 推荐,自动 HTTPS
- **Netlify** - 自动 HTTPS
- **GitHub Pages** - 免费,支持 HTTPS
- **Cloudflare Pages** - 快速,全球 CDN

## 📚 相关文档

- [PWA_SETUP.md](./PWA_SETUP.md) - 完整配置指南
- [Web.dev PWA](https://web.dev/progressive-web-apps/)
- [MDN Service Worker](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
