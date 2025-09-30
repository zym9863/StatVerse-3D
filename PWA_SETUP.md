# PWA 配置说明

本项目已成功配置为渐进式 Web 应用 (PWA)!

## 📦 已添加的文件

1. **public/manifest.json** - PWA 应用清单文件
2. **public/sw.js** - Service Worker 用于离线缓存
3. **generate_icons.py** - Python 脚本用于生成应用图标
4. **index.html** - 已更新,添加 PWA 支持

## 🚀 使用步骤

### 1. 生成应用图标

首先确保已安装 Pillow 库:

```bash
pip install Pillow
```

然后运行图标生成脚本:

```bash
python generate_icons.py
```

或使用 npm 脚本:

```bash
npm run generate-icons
```

这将从 `icon.png` 生成以下尺寸的图标到 `public/icons/` 目录:
- 72x72, 96x96, 128x128, 144x144
- 152x152, 192x192, 384x384, 512x512

### 2. 构建和部署

```bash
# 开发模式
npm run dev

# 生产构建
npm run build

# 预览构建结果
npm run preview
```

## ✨ PWA 功能

### 离线支持
- Service Worker 缓存核心资源
- 网络断开时仍可访问应用

### 可安装
- 用户可将应用安装到主屏幕
- 像原生应用一样运行

### 跨平台
- 支持 Windows、macOS、Linux
- 支持 iOS、Android 移动设备

## 🔧 自定义配置

### 修改应用信息

编辑 `public/manifest.json`:

```json
{
  "name": "你的应用名称",
  "short_name": "短名称",
  "description": "应用描述",
  "theme_color": "#你的主题色",
  "background_color": "#背景色"
}
```

### 调整缓存策略

编辑 `public/sw.js` 中的 `urlsToCache` 数组,添加需要缓存的资源。

## 📱 测试 PWA

### Chrome/Edge 浏览器
1. 访问应用 (需要 HTTPS 或 localhost)
2. 打开开发者工具 (F12)
3. 切换到 "Application" 标签
4. 查看 "Manifest" 和 "Service Workers" 部分

### 安装测试
1. 访问应用
2. 地址栏右侧会出现安装图标
3. 点击安装即可添加到桌面

## 🌐 部署要求

PWA 需要 HTTPS 才能正常工作 (localhost 除外)。部署到以下平台:

- **Vercel**: 自动支持 HTTPS
- **Netlify**: 自动支持 HTTPS
- **GitHub Pages**: 支持 HTTPS
- **自定义服务器**: 需配置 SSL 证书

## 📚 更多资源

- [PWA 官方文档](https://web.dev/progressive-web-apps/)
- [Service Worker API](https://developer.mozilla.org/zh-CN/docs/Web/API/Service_Worker_API)
- [Web App Manifest](https://developer.mozilla.org/zh-CN/docs/Web/Manifest)
