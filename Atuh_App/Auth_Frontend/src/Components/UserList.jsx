import React, { useEffect, useState } from 'react';
import { fetchUsers } from '../api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(response => {
        setUsers(response.data.users);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b-2 border-gray-200">Google ID</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">LinkedIn ID</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Email</th>
            <th className="py-2 px-4 border-b-2 border-gray-200">Name</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.googleId || user.linkedinId}>
              <td className="py-2 px-4 border-b border-gray-200">{user.googleId}</td>
              <td className="py-2 px-4 border-b border-gray-200">{user.linkedinId}</td>
              <td className="py-2 px-4 border-b border-gray-200">{user.email}</td>
              <td className="py-2 px-4 border-b border-gray-200">{user.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
