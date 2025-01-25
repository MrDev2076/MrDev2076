import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Profile = () => {
  const [profile, setProfile] = useState({ name: '', email: '', profilePicture: '' });
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    // Fetch profile data when the component loads
    axios.get('http://localhost:8081/get-profile', { withCredentials: true })
      .then(response => {
        setProfile(response.data);
      })
      .catch(err => console.error(err));
  }, []);

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', profile.name);
    formData.append('email', profile.email);
    if (newProfilePicture) {
      formData.append('profilePicture', newProfilePicture);
    }

    axios.post('http://localhost:8081/update-profile', formData, { withCredentials: true })
      .then(response => {
        alert('Profile updated successfully');
      })
      .catch(err => {
        console.error(err);
        alert('Error updating profile');
      });
  };

  return (
    <div className="profile-container">
      <h2>Update Profile</h2>
      <form onSubmit={handleProfileUpdate}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            className="form-control"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label>Profile Picture</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setNewProfilePicture(e.target.files[0])}
          />
        </div>
        <button type="submit" className="btn btn-primary">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
