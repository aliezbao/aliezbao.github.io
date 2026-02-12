// 获取 URL 参数
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// 加载文章内容
async function loadPost() {
    const postId = getQueryParam('id');
    
    if (!postId) {
        document.getElementById('post-content').innerHTML = '<p>文章不存在</p>';
        return;
    }
    
    try {
        // 加载文章索引获取文章信息
        const indexResponse = await fetch('posts/index.json');
        const posts = await indexResponse.json();
        const postInfo = posts.find(p => p.id === postId);
        
        if (!postInfo) {
            throw new Error('文章不存在');
        }
        
        // 加载 Markdown 文件
        const mdResponse = await fetch(`posts/${postInfo.file}`);
        const markdown = await mdResponse.text();
        
        // 转换 Markdown 为 HTML
        const html = marked.parse(markdown);
        
        // 显示文章
        document.getElementById('post-content').innerHTML = `
            <h1>${postInfo.title}</h1>
            <div class="post-meta">${postInfo.date}</div>
            <div class="post-body">${html}</div>
        `;
        
        // 更新页面标题
        document.title = `${postInfo.title} - 我的博客`;
        
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('post-content').innerHTML = '<p>加载文章失败，请稍后再试。</p>';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPost);
