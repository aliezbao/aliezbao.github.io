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
        
        // 计算字数和阅读时间
        const wordCount = calculateWordCount(markdown);
        const readTime = Math.ceil(wordCount / 300); // 假设每分钟阅读300字
        
        // 显示文章
        const tagsHTML = postInfo.tags ? 
            `<div class="post-tags">
                ${postInfo.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
            </div>` : '';
        
        document.getElementById('post-content').innerHTML = `
            <h1>${postInfo.title}</h1>
            ${tagsHTML}
            <div class="post-meta">
                📅 ${postInfo.date}
                <div class="post-stats">
                    <span>📖 约 ${readTime} 分钟</span>
                    <span>📝 ${wordCount} 字</span>
                </div>
            </div>
            <div class="post-body">${html}</div>
        `;
        
        // 更新页面标题
        document.title = `${postInfo.title} - 我的博客`;
        
        // 初始化功能
        initReadingProgress();
        initTableOfContents();
        highlightCode();
        addCopyButtons();
        lazyLoadImages();
        initKeyboardNavigation(postInfo, posts);
        initShareButton();
        initPrintButton();
        
    } catch (error) {
        console.error('加载文章失败:', error);
        document.getElementById('post-content').innerHTML = '<p>加载文章失败，请稍后再试。</p>';
    }
}

// 阅读进度条
function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    
    window.addEventListener('scroll', () => {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    });
}

// 生成目录
function initTableOfContents() {
    const postBody = document.querySelector('.post-body');
    const tocNav = document.getElementById('toc-nav');
    const toc = document.getElementById('toc');
    
    if (!postBody || !tocNav) return;
    
    const headings = postBody.querySelectorAll('h2, h3');
    
    if (headings.length === 0) {
        toc.style.display = 'none';
        return;
    }
    
    headings.forEach((heading, index) => {
        // 为标题添加 ID
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        // 创建目录链接
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = heading.tagName === 'H3' ? 'toc-h3' : '';
        
        tocNav.appendChild(link);
    });
    
    // 监听滚动，高亮当前标题
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocNav.querySelectorAll('a').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: '-80px 0px -80% 0px'
    });
    
    headings.forEach(heading => observer.observe(heading));
}

// 代码高亮
function highlightCode() {
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}

// 为代码块添加复制按钮
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-code-btn';
        button.textContent = '复制';
        button.style.cssText = `
            position: absolute;
            top: 8px;
            right: 8px;
            padding: 6px 12px;
            background: rgba(255, 255, 255, 0.1);
            color: #f5f5f7;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.background = 'rgba(255, 255, 255, 0.1)';
        });
        
        button.addEventListener('click', async () => {
            const code = codeBlock.textContent;
            try {
                await navigator.clipboard.writeText(code);
                button.textContent = '已复制!';
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            } catch (err) {
                console.error('复制失败:', err);
                button.textContent = '复制失败';
                setTimeout(() => {
                    button.textContent = '复制';
                }, 2000);
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
    });
}

// 图片懒加载
function lazyLoadImages() {
    const images = document.querySelectorAll('.post-body img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// 键盘导航
function initKeyboardNavigation(currentPost, allPosts) {
    const currentIndex = allPosts.findIndex(p => p.id === currentPost.id);
    
    document.addEventListener('keydown', (e) => {
        // 左箭头 - 上一篇
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            window.location.href = `post.html?id=${allPosts[currentIndex - 1].id}`;
        }
        // 右箭头 - 下一篇
        else if (e.key === 'ArrowRight' && currentIndex < allPosts.length - 1) {
            window.location.href = `post.html?id=${allPosts[currentIndex + 1].id}`;
        }
        // ESC - 返回首页
        else if (e.key === 'Escape') {
            window.location.href = 'index.html';
        }
    });
}

// 计算字数
function calculateWordCount(text) {
    // 移除 Markdown 标记
    const plainText = text
        .replace(/```[\s\S]*?```/g, '') // 移除代码块
        .replace(/`[^`]*`/g, '') // 移除行内代码
        .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片
        .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接
        .replace(/[#*_~`]/g, '') // 移除 Markdown 符号
        .replace(/\s+/g, ''); // 移除空白字符
    
    // 计算中文字符和英文单词
    const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || [];
    const englishWords = plainText.match(/[a-zA-Z]+/g) || [];
    
    return chineseChars.length + englishWords.length;
}

// 分享按钮功能
function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    
    shareBtn.addEventListener('click', async () => {
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            showToast('链接已复制到剪贴板！');
        } catch (err) {
            console.error('复制失败:', err);
            showToast('复制失败，请手动复制链接');
        }
    });
}

// 打印按钮功能
function initPrintButton() {
    const printBtn = document.getElementById('print-btn');
    
    printBtn.addEventListener('click', () => {
        window.print();
    });
}

// 显示提示消息
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'share-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideUp 0.3s ease-out reverse';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 2000);
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPost);
