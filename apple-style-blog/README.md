# 静态博客网站

一个简洁优雅的静态博客网站，采用苹果公司的设计风格，前后端分离架构。

## 特点

- 🎨 苹果风格设计，简洁优雅
- 📝 使用 Markdown 编写文章
- 🚀 纯静态，易于部署
- 📱 响应式设计，支持移动端
- ⚡ 无需后端，加载快速

## 文件结构

```
.
├── index.html          # 首页
├── post.html           # 文章详情页
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── app.js          # 首页逻辑
│   └── post.js         # 文章页逻辑
├── posts/
│   ├── index.json      # 文章索引
│   ├── hello-world.md  # 示例文章
│   └── markdown-guide.md
└── README.md
```

## 使用方法

### 1. 添加新文章

在 `posts` 目录下创建新的 Markdown 文件，例如 `my-post.md`。

### 2. 更新文章索引

编辑 `posts/index.json`，添加文章信息：

```json
{
    "id": "my-post",
    "title": "我的文章标题",
    "date": "2026-02-12",
    "file": "my-post.md",
    "excerpt": "文章摘要描述"
}
```

### 3. 本地预览

使用任何静态服务器预览网站，例如：

```bash
# 使用 Python
python -m http.server 8000

# 使用 Node.js
npx serve

# 使用 PHP
php -S localhost:8000
```

然后访问 `http://localhost:8000`

## 部署到 GitHub Pages

### 方法一：通过仓库设置

1. 将代码推送到 GitHub 仓库
2. 进入仓库的 Settings > Pages
3. 在 Source 中选择 `main` 分支
4. 点击 Save，等待部署完成
5. 访问 `https://你的用户名.github.io/仓库名`

### 方法二：使用 GitHub Actions

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./
```

## 自定义

### 修改网站标题和信息

编辑 `index.html` 和 `post.html` 中的以下内容：

- `<title>` 标签
- 导航栏中的 logo
- 页脚信息

### 修改样式

编辑 `css/style.css` 来自定义颜色、字体等样式。

### 添加功能

可以在 `js/app.js` 和 `js/post.js` 中添加更多功能，例如：

- 搜索功能
- 标签分类
- 评论系统（使用第三方服务）
- 深色模式

## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+)
- [Marked.js](https://marked.js.org/) - Markdown 解析器

## 浏览器支持

支持所有现代浏览器：

- Chrome
- Firefox
- Safari
- Edge

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
