// 博客配置
const config = {
    postsPath: 'posts/',
    postsIndex: 'posts/index.json'
};

let allPosts = [];
let currentTag = 'all';
let currentSort = 'date-desc';
let searchQuery = '';

// 加载文章列表
async function loadPosts() {
    try {
        const response = await fetch(config.postsIndex);
        allPosts = await response.json();
        
        // 初始化标签筛选器
        initTagsFilter();
        
        // 显示文章
        renderPosts();
        
        // 初始化搜索功能
        initSearch();
        
        // 初始化排序功能
        initSort();
        
    } catch (error) {
        console.error('加载文章列表失败:', error);
        document.getElementById('posts').innerHTML = '<p>加载文章失败，请稍后再试。</p>';
    }
}

// 初始化标签筛选器
function initTagsFilter() {
    const tagsSet = new Set();
    allPosts.forEach(post => {
        if (post.tags) {
            post.tags.forEach(tag => tagsSet.add(tag));
        }
    });
    
    const tagsFilter = document.getElementById('tags-filter');
    const allButton = tagsFilter.querySelector('[data-tag="all"]');
    
    tagsSet.forEach(tag => {
        const button = document.createElement('button');
        button.className = 'tag-btn';
        button.dataset.tag = tag;
        button.textContent = tag;
        button.addEventListener('click', () => filterByTag(tag));
        tagsFilter.appendChild(button);
    });
    
    allButton.addEventListener('click', () => filterByTag('all'));
}

// 按标签筛选
function filterByTag(tag) {
    currentTag = tag;
    
    // 更新按钮状态
    document.querySelectorAll('.tag-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tag === tag);
    });
    
    renderPosts();
}

// 初始化搜索功能
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search');
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        clearBtn.style.display = searchQuery ? 'block' : 'none';
        renderPosts();
    });
    
    clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearBtn.style.display = 'none';
        renderPosts();
    });
}

// 初始化排序功能
function initSort() {
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        renderPosts();
    });
}

// 渲染文章列表
function renderPosts() {
    let filteredPosts = allPosts;
    
    // 按标签筛选
    if (currentTag !== 'all') {
        filteredPosts = filteredPosts.filter(post => 
            post.tags && post.tags.includes(currentTag)
        );
    }
    
    // 搜索筛选
    if (searchQuery) {
        filteredPosts = filteredPosts.filter(post => 
            post.title.toLowerCase().includes(searchQuery) ||
            post.excerpt.toLowerCase().includes(searchQuery) ||
            (post.tags && post.tags.some(tag => tag.toLowerCase().includes(searchQuery)))
        );
    }
    
    // 排序
    filteredPosts = sortPosts(filteredPosts, currentSort);
    
    // 显示结果
    const postsContainer = document.getElementById('posts');
    const noResults = document.getElementById('no-results');
    
    if (filteredPosts.length === 0) {
        postsContainer.innerHTML = '';
        noResults.style.display = 'block';
    } else {
        noResults.style.display = 'none';
        postsContainer.innerHTML = '';
        filteredPosts.forEach(post => {
            const postCard = createPostCard(post);
            postsContainer.appendChild(postCard);
        });
    }
}

// 排序文章
function sortPosts(posts, sortType) {
    const sorted = [...posts];
    
    switch(sortType) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'title-asc':
            return sorted.sort((a, b) => a.title.localeCompare(b.title, 'zh-CN'));
        case 'title-desc':
            return sorted.sort((a, b) => b.title.localeCompare(a.title, 'zh-CN'));
        default:
            return sorted;
    }
}

// 创建文章卡片
function createPostCard(post) {
    const card = document.createElement('a');
    card.href = `post.html?id=${post.id}`;
    card.className = 'post-card';
    
    const tagsHTML = post.tags ? 
        `<div class="post-tags">
            ${post.tags.map(tag => `<span class="post-tag">${tag}</span>`).join('')}
        </div>` : '';
    
    const readTime = post.readTime ? `<span>📖 ${post.readTime} 分钟</span>` : '';
    
    card.innerHTML = `
        <h3>${post.title}</h3>
        ${tagsHTML}
        <div class="post-meta">
            <span>📅 ${post.date}</span>
            ${readTime}
        </div>
        <div class="post-excerpt">${post.excerpt}</div>
    `;
    
    return card;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadPosts);
