var posts=["2025/02/19/hello-world/","2025/02/19/第一篇/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };