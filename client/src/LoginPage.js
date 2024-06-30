import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegistering ? '/api/register' : '/api/login';
      const response = await axios.post(`http://localhost:5002${endpoint}`, { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/admin');
    } catch (error) {
      setError(isRegistering ? 'Error registering new user' : 'Invalid username or password');
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError('');
  };

  return (
    <div className="login-page">
      <h1>{isRegistering ? 'Register New User' : 'Admin Login'}</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
      </form>
      <button onClick={toggleMode}>
        {isRegistering ? 'Back to Login' : 'Register New User'}
      </button>
    </div>
  );
}

export default LoginPage;