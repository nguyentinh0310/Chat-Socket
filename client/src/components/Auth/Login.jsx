import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] =useState('')
  const [password,setPassword] = useState('')

  const handleSubmit =(e) =>{
      e.preventDefault()
  }
  return (
    <div className="wrapper">
    <div className="form">
      <h1 className="title">Chat Application</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="Username" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Password" required />
        <div align="center">
          <button type="submit" className="button">
            <span>Start chatting</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  );
};

export default Login;
