import React, { useState } from 'react';
import api from '../Api';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const SignUp = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/signup', formData);
            alert(response.data.message || 'Sign-up successful!');
            Navigate('/signin');
        } catch (error) {
            alert(error.response?.data?.message || 'An error occurred');
        }
    };
    return (
        <form onSubmit={handleSubmit}>
            <h2>Sign Up</h2>
            <input type="text" name="firstName" placeholder="First Name" onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <button type="submit">Sign Up</button>
        </form>
    );
};

export default SignUp;
