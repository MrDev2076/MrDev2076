import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [error, setError] = useState(null); // State to store error messages

  // Fetch all users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/users', { withCredentials: true }); // Ensure cookies are sent
      if (response.data.Status === 'Success') {
        setUsers(response.data.users); // Update users state
        setError(null); // Clear errors
      } else {
        setError('Failed to fetch users.');
      }
    } catch (err) {
      setError('Error fetching users: ' + err.message);
    }
  };

  // Function to delete a user
  const deleteUser = async (userId) => {
    try {
      const response = await axios.delete(`/api/users/${userId}`, { withCredentials: true });
      if (response.data.Status === 'Success') {
        setUsers(users.filter((user) => user._id !== userId)); // Update user list locally
      } else {
        setError('Failed to delete user.');
      }
    } catch (err) {
      setError('Error deleting user: ' + err.message);
    }
  };

  // Function to update a user's role
  const updateUserRole = async (userId, newRole) => {
    try {
      const response = await axios.patch(
        `/api/users/${userId}`,
        { role: newRole },
        { withCredentials: true }
      );
      if (response.data.Status === 'Success') {
        fetchUsers(); // Refresh the user list
      } else {
        setError('Failed to update user role.');
      }
    } catch (err) {
      setError('Error updating user role: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      {error && <p className="text-danger">{error}</p>} {/* Display errors if any */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                {/* Delete button */}
                {user.role !== 'admin' && (
                  <button
                    className="btn btn-danger btn-sm me-2"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                )}
                {/* Role update buttons */}
                {user.role !== 'admin' && (
                  <button
                    className="btn btn-primary btn-sm me-2"
                    onClick={() => updateUserRole(user._id, 'admin')}
                  >
                    Promote to Admin
                  </button>
                )}
                {user.role === 'admin' && (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => updateUserRole(user._id, 'user')}
                  >
                    Remove as Admin
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
