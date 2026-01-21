'use client';

import { useEffect, useState } from 'react';
import API from '../../../lib/api';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  // Edit mode tracking
  const [editId, setEditId] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = async (e) => {
    e.preventDefault();

    try {
      await API.post('/users', {
        name,
        email,
        password,
        role,
      });

      setName('');
      setEmail('');
      setPassword('');
      setRole('user');

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async (id) => {
    try {
      await API.put(`/users/${id}`, {
        name,
        email,
        role,
      });

      setEditId(null);
      setName('');
      setEmail('');
      setRole('user');

      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users Management</h1>

      {/* Add / Edit Form */}
      <form onSubmit={editId ? () => handleEditSave(editId) : handleAddUser} className="mb-6 flex space-x-2">
        <input
          className="p-2 border rounded"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          className="p-2 border rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {!editId && (
          <input
            className="p-2 border rounded"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        )}

        <select
          className="p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button className="bg-blue-600 text-white px-4 rounded" type="submit">
          {editId ? 'Save Changes' : 'Add User'}
        </button>
      </form>

      {/* Users Table */}
      <table className="w-full border">
        <thead className="bg-gray-200">
          <tr>
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Role</th>
            <th className="border p-2 w-32">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td className="border p-2">{u.name}</td>
              <td className="border p-2">{u.email}</td>
              <td className="border p-2">{u.role}</td>
              <td className="border p-2 flex space-x-2">

                {/* EDIT BUTTON */}
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setEditId(u._id);
                    setName(u.name);
                    setEmail(u.email);
                    setRole(u.role);
                  }}
                >
                  Edit
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
