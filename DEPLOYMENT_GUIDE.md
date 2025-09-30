# PWA 自动部署配置示例
# 这些文件可以帮助您自动部署 PWA

## GitHub Pages 部署

创建 `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'

      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'

      - name: Install Python dependencies
        run: pip install -r requirements.txt

      - name: Generate PWA icons
        run: python generate_icons.py

      - name: Install dependencies
        run: npm install

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Vercel 部署

创建 `vercel.json`:

```json
{
  "buildCommand": "python generate_icons.py && npm run build",
  "outputDirectory": "dist",
  "installCommand": "pip install -r requirements.txt && npm install",
  "devCommand": "npm run dev",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/sw.js",
      "destination": "/sw.js"
    },
    {
      "source": "/manifest.json",
      "destination": "/manifest.json"
    }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        {
          "key": "Service-Worker-Allowed",
          "value": "/"
        },
        {
          "key": "Cache-Control",
          "value": "public, max-age=0, must-revalidate"
        }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        {
          "key": "Content-Type",
          "value": "application/manifest+json"
        }
      ]
    }
  ]
}
```

## Netlify 部署

创建 `netlify.toml`:

```toml
[build]
  command = "pip install -r requirements.txt && python generate_icons.py && npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/sw.js"
  [headers.values]
    Service-Worker-Allowed = "/"
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/manifest.json"
  [headers.values]
    Content-Type = "application/manifest+json"

[[headers]]
  for = "/icons/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## Cloudflare Pages 部署

在 Cloudflare Pages 控制面板设置:

**构建设置:**
- 构建命令: `pip install -r requirements.txt && python generate_icons.py && npm run build`
- 构建输出目录: `dist`
- 根目录: `/`

**环境变量:**
- `NODE_VERSION`: `20`
- `PYTHON_VERSION`: `3.9`

## 手动部署

### 1. 准备生产构建

```bash
# 生成图标
python generate_icons.py

# 构建
npm run build
```

### 2. 部署 dist 目录

将 `dist/` 目录的内容上传到:
- 任何静态托管服务
- 自己的 Web 服务器
- CDN

### 3. 配置 Web 服务器

**Nginx 配置示例:**

```nginx
server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /path/to/dist;
    index index.html;

    # Service Worker
    location /sw.js {
        add_header Service-Worker-Allowed "/";
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    # Manifest
    location /manifest.json {
        add_header Content-Type "application/manifest+json";
    }

    # 图标缓存
    location /icons/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # SPA 路由
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache 配置示例:**

```apache
<VirtualHost *:443>
    ServerName your-domain.com
    DocumentRoot /path/to/dist

    SSLEngine on
    SSLCertificateFile /path/to/cert.pem
    SSLCertificateKeyFile /path/to/key.pem

    # Service Worker
    <Files "sw.js">
        Header set Service-Worker-Allowed "/"
        Header set Cache-Control "public, max-age=0, must-revalidate"
    </Files>

    # Manifest
    <Files "manifest.json">
        Header set Content-Type "application/manifest+json"
    </Files>

    # 图标缓存
    <Directory "/path/to/dist/icons">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </Directory>

    # SPA 路由
    <Directory /path/to/dist>
        Options -MultiViews
        RewriteEngine On
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteRule ^ index.html [QSA,L]
    </Directory>
</VirtualHost>
```

## 部署验证清单

部署后验证:

- [ ] HTTPS 正常工作
- [ ] manifest.json 可访问
- [ ] sw.js 可访问
- [ ] 所有图标可访问
- [ ] Service Worker 注册成功
- [ ] 应用可安装
- [ ] 离线访问正常

## 快速部署命令

### Vercel CLI
```bash
npm i -g vercel
vercel --prod
```

### Netlify CLI
```bash
npm i -g netlify-cli
netlify deploy --prod
```

### Firebase Hosting
```bash
npm i -g firebase-tools
firebase init hosting
firebase deploy
```

## 注意事项

1. **HTTPS 必需**: PWA 必须通过 HTTPS 提供服务
2. **Service Worker 作用域**: 确保 sw.js 在根目录
3. **缓存策略**: 注意更新 CACHE_NAME 版本
4. **图标路径**: 确保所有图标路径正确
5. **跨域资源**: 如果使用 CDN,配置 CORS

---

选择最适合您的部署方式,开始部署您的 PWA!
