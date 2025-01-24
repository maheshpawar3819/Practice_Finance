import React, { useState } from 'react';
import axios from 'axios';

const CreateUserForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [googleId, setGoogleId] = useState('');
  const [linkedinId, setLinkedinId] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/create-user', { 
        name, 
        email, 
        password, 
        googleId, 
        linkedinId 
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error creating user');
    }
  };

  return (
    <div>
      <h2>Create User</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label>Google ID:</label>
          <input type="text" value={googleId} onChange={(e) => setGoogleId(e.target.value)} />
        </div>
        <div>
          <label>LinkedIn ID:</label>
          <input type="text" value={linkedinId} onChange={(e) => setLinkedinId(e.target.value)} />
        </div>
        <button type="submit">Create User</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default CreateUserForm;
