// 归档页面功能
async function loadArchive() {
    try {
        const response = await fetch('posts/index.json');
        const posts = await response.json();
        
        // 按年月分组
        const groupedPosts = groupPostsByYearMonth(posts);
        
        // 更新统计信息
        document.getElementById('archive-stats').textContent = `共 ${posts.length} 篇文章`;
        
        // 渲染归档内容
        renderArchive(groupedPosts);
        
    } catch (error) {
        console.error('加载归档失败:', error);
        document.getElementById('archive-content').innerHTML = '<p>加载归档失败，请稍后再试。</p>';
    }
}

// 按年月分组文章
function groupPostsByYearMonth(posts) {
    const grouped = {};
    
    posts.forEach(post => {
        const date = new Date(post.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const key = `${year}-${month.toString().padStart(2, '0')}`;
        
        if (!grouped[key]) {
            grouped[key] = {
                year,
                month,
                posts: []
            };
        }
        
        grouped[key].posts.push(post);
    });
    
    return grouped;
}


// 渲染归档内容
function renderArchive(groupedPosts) {
    const archiveContent = document.getElementById('archive-content');
    archiveContent.innerHTML = '';
    
    // 按年月倒序排列
    const sortedKeys = Object.keys(groupedPosts).sort().reverse();
    
    sortedKeys.forEach(key => {
        const group = groupedPosts[key];
        const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', 
                           '七月', '八月', '九月', '十月', '十一月', '十二月'];
        
        const section = document.createElement('div');
        section.className = 'archive-section';
        
        const header = document.createElement('h3');
        header.className = 'archive-header';
        header.textContent = `${group.year} 年 ${monthNames[group.month - 1]}`;
        section.appendChild(header);
        
        const list = document.createElement('ul');
        list.className = 'archive-list';
        
        // 按日期倒序排列
        group.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        group.posts.forEach(post => {
            const item = document.createElement('li');
            item.className = 'archive-item';
            
            const link = document.createElement('a');
            link.href = `post.html?id=${post.id}`;
            link.className = 'archive-link';
            
            const date = document.createElement('span');
            date.className = 'archive-date';
            date.textContent = post.date;
            
            const title = document.createElement('span');
            title.className = 'archive-title';
            title.textContent = post.title;
            
            link.appendChild(date);
            link.appendChild(title);
            item.appendChild(link);
            list.appendChild(item);
        });
        
        section.appendChild(list);
        archiveContent.appendChild(section);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', loadArchive);
