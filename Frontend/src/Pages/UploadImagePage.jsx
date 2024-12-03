import React, { useState, useEffect } from 'react';
import api from '../Api';  // Import the axios instance

const UploadImagePage = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null); // Store user profile data

    useEffect(() => {
        // Fetch the current user's profile when the component mounts
        const fetchUserProfile = async () => {
            try {
                const response = await api.get('/profile');  // Assuming '/profile' is your route to get user profile
                setUserProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
                setMessage('Failed to fetch user profile.');
            }
        };

        fetchUserProfile();
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedImage) {
            setMessage('Please select an image before submitting.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);

        try {
            const response = await api.post('/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Image uploaded successfully:', response.data);
            setMessage('Image uploaded successfully!');
        } catch (error) {
            console.error('Error uploading image:', error);
            setMessage('Failed to upload image. ' + (error.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div>
            <h1>Upload Image</h1>
            
            {/* Display user profile */}
            {userProfile ? (
                <div>
                    <h2>Welcome, {userProfile.firstName} {userProfile.lastName}</h2>
                    <p>Email: {userProfile.email}</p>
                    {/* Display profile image if available */}
                    {userProfile.imageData ? (
                        <img 
                            src={`data:image/jpeg;base64,${userProfile.imageData}`} 
                            alt="Profile" 
                            style={{ width: 100, height: 100, borderRadius: '50%' }} 
                        />
                    ) : (
                        <p>No profile image available.</p>
                    )}
                </div>
            ) : (
                <p>Loading profile...</p>
            )}

            {/* Image upload form */}
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} />
                <button type="submit">Upload Image</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default UploadImagePage;
