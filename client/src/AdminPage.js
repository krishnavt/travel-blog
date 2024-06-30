import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
  // ... (existing state)
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5002/api/admin/posts', 
        { title, content, author, category },
        { headers: { 'Authorization': token } }
      );
      setMessage('Post added successfully!');
      // ... (reset form fields)
    } catch (error) {
      setMessage('Error adding post. Please try again.');
      console.error('Error adding post:', error);
    }
  };

  // ... (rest of the component)
}

export default AdminPage;