import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api'; 

const SignIn = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        try {
            const response = await api.post('/signin', formData);
            localStorage.setItem('token', response.data.token);

            
            alert('Login successful!');
            navigate('/homepage');
        } catch (error) {
            const message =
                error.response?.data?.message || 'An error occurred during login.';
            setErrorMessage(message);
        }
    };

    return (
        <div>
            <h2>Sign In</h2>
            {}
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

            <form onSubmit={handleSubmit}>
                {}
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                {}
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                {}
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default SignIn;
