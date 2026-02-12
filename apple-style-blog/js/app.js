// 博客配置
const config = {
    postsPath: 'posts/',
    postsIndex: 'posts/index.json'
};

// 加载文章列表
async function loadPosts() {
    try {
        const response = await fetch(config.postsIndex);
        const posts = await response.json();
        
        const postsContainer = document.getElementById('posts');
        postsContainer.innerHTML = '';
        
        posts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
    } catch (error) {
        console.error('加载文章列表失败:', error);
        document.getElementById('posts').innerHTML = '<p>加载文章失败，请稍后再试。</p>';
    }
}

// 创建文章卡片
function createPostCard(post) {
    const card = document.createElement('a');
    card.href = `post.html?id=${post.id}`;
    card.className = 'post-card';
    
    card.innerHTML = `
        <h3>${post.title}</h3>
        <div class="post-meta">${post.date}</div>
        <div class="post-excerpt">${post.excerpt}</div>
    `;
    
    return card;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);
