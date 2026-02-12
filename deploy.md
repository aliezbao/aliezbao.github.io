# 部署到 GitHub Pages 指南

## 方法一：通过 GitHub 网站创建仓库

### 1. 创建 GitHub 仓库

1. 访问 https://github.com/new
2. 填写仓库信息：
   - Repository name: `my-blog` (或你喜欢的名字)
   - Description: `我的静态博客`
   - 选择 Public
   - 不要勾选 "Initialize this repository with a README"
3. 点击 "Create repository"

### 2. 推送代码到 GitHub

在当前项目目录下运行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "Initial commit: 创建静态博客"

# 添加远程仓库（替换 YOUR_USERNAME 和 REPO_NAME）
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# 推送到 GitHub
git branch -M main
git push -u origin main
```

### 3. 启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 "Settings" (设置)
3. 在左侧菜单找到 "Pages"
4. 在 "Source" 下选择：
   - Branch: `main`
   - Folder: `/ (root)`
5. 点击 "Save"
6. 等待几分钟，页面会显示你的网站地址：`https://YOUR_USERNAME.github.io/REPO_NAME`

## 方法二：使用 GitHub CLI (推荐)

如果你安装了 GitHub CLI (gh)，可以使用以下命令：

```bash
# 登录 GitHub (如果还没登录)
gh auth login

# 创建仓库并推送
gh repo create my-blog --public --source=. --remote=origin --push

# 启用 GitHub Pages
gh api repos/{owner}/{repo}/pages -X POST -f source[branch]=main -f source[path]=/
```

## 方法三：使用 GitHub Actions 自动部署

创建 `.github/workflows/deploy.yml` 文件（已在下方创建），然后：

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git
git push -u origin main
```

GitHub Actions 会自动部署你的网站。

## 更新博客内容

每次添加新文章后：

```bash
git add .
git commit -m "添加新文章"
git push
```

网站会自动更新（如果使用 GitHub Actions）或在几分钟后更新。

## 自定义域名（可选）

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名：
   ```
   blog.yourdomain.com
   ```

2. 在你的域名提供商处添加 DNS 记录：
   - 类型: CNAME
   - 名称: blog (或 @)
   - 值: YOUR_USERNAME.github.io

3. 在 GitHub Pages 设置中输入你的自定义域名

## 故障排除

### 问题：页面显示 404

- 确保 GitHub Pages 已启用
- 检查分支名称是否为 `main`
- 等待 5-10 分钟让 GitHub 构建网站

### 问题：样式或 JS 不加载

- 检查浏览器控制台的错误信息
- 确保所有文件路径使用相对路径
- 如果仓库名不是根目录，可能需要调整路径

### 问题：文章不显示

- 检查 `posts/index.json` 格式是否正确
- 确保 Markdown 文件路径正确
- 打开浏览器开发者工具查看网络请求

## 需要帮助？

查看 GitHub Pages 官方文档：https://docs.github.com/pages
