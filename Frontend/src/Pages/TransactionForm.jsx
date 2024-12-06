import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/TransactionForm.css';

const TransactionForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/subscription/transaction');
                setUserData({ ...response.data, plan: state?.selectedPlan || response.data.plan });
                setPaymentMethod(response.data.paymentMethod || '');
            } catch (error) {
                setErrorMessage('Error fetching user data. Please try again later.');
                console.error('Error in fetchUserData:', error);
            }
        };

        fetchUserData();
    }, [state?.selectedPlan]);

    const handleInputChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!paymentMethod) {
            alert('Please select a payment method.');
            return;
        }

        try {
            await api.post('/subscription/transaction', {
                ...userData,
                paymentMethod,
            });
            alert('Subscription updated successfully!');
            navigate('/homepage');
        } catch (error) {
            setErrorMessage('Error updating subscription. Please try again.');
            console.error('Error in handleSubmit:', error);
        }
    };

    if (!userData) {
        return <p>Loading...</p>;
    }

    return (
        <div className="transaction-form-container">
            <h1>Finalize Subscription</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <form onSubmit={handleSubmit} className="transaction-form">
                <div className="form-group">
                    <label>First Name</label>
                    <input type="text" value={userData.firstName} readOnly />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" value={userData.lastName} readOnly />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={userData.email} readOnly />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={userData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Street</label>
                    <input
                        type="text"
                        value={userData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={userData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Barangay</label>
                    <input
                        type="text"
                        value={userData.barangay || ''}
                        onChange={(e) => handleInputChange('barangay', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Zip Code</label>
                    <input
                        type="text"
                        value={userData.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Plan</label>
                    <input type="text" value={userData.plan} readOnly />
                </div>
                <div className="form-group">
                    <label>Payment Method</label>
                    <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select a payment method
                        </option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="PayPal">PayPal</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">
                    Update Subscription
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
