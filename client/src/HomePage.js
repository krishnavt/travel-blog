import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5002/api/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to fetch posts. Please try again later.');
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="home-page">
      <h1>Travel Blog</h1>
      <section className="posts-list">
        <h2>Recent Posts</h2>
        {posts.length > 0 ? (
          posts.map((post) => (
            <article key={post._id} className="post-card">
              <h3>{post.title}</h3>
              <p className="post-content">{post.content}</p>
              <p className="post-category">Category: {post.category}</p>
              <footer>
                <span className="post-author">By: {post.author}</span>
                <span className="post-date">{new Date(post.date).toLocaleDateString()}</span>
              </footer>
            </article>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </section>
    </div>
  );
}

export default HomePage;