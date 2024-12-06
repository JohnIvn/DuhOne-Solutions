import React, { useState, useEffect } from 'react';
import api from '../Api.js';
import '../CSS/UserProfile.css';

const UserProfile = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/userprofile');
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setPhoneNumber();
            } catch (error) {
                setErrorMessage(error.response?.data?.message || 'Error fetching user profile');
            }
        };

        fetchUserProfile();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await api.put('/userprofile', {
            firstName,
            lastName,
            phoneNumber,
            street,
            city, 
            barangay, 
            zipCode
            });

            alert('Profile updated successfully!');
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-picture">
                    {/* Profile Picture */}
                    <img src="/path/to/your/profile-picture.jpg" alt="Profile" />
                </div>
                <div className="profile-info">
                    <h2>{firstName} {lastName}</h2>
                    <p>@{firstName.toLowerCase()}-Jeff</p>
                </div>
            </div>
            <div className="bio-section">
                <p>Hi, I'm {firstName}! I’m interested in web development, game development, and coding puzzles. I'm currently learning Java, C++, Python, and Unity (Game development). I’m looking to collaborate on exciting projects!</p>
            </div>
            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Update Profile</button>
            </form>

            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default UserProfile;