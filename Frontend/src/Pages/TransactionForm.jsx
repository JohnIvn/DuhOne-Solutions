import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/TransactionForm.css';

const TransactionForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [bankName, setBankName] = useState('');  // Renamed paymentMethod to bankName
    const [errorMessage, setErrorMessage] = useState('');

    // Get the plan's name from the selectedPlan passed in state
    const planName = state?.selectedPlan?.plan || "No plan selected";  // Default if no plan

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/subscription/transaction');
                const data = response.data;
    
                // Log the entire response to see if bankName exists
                console.log('API Response:', data);
    
                // Assuming that the bank name is available in response data, adjust as needed
                const fetchedBankName = data.bankName || '';  // Adjust if the API response has a different structure
    
                setUserData({ ...data, plan: state?.selectedPlan || data.plan });
                setBankName(fetchedBankName);  // Set the bank name
            } catch (error) {
                setErrorMessage('Error fetching user data. Please try again later.');
                console.error('Error in fetchUserData:', error);
            }
        };
    
        fetchUserData();
    }, [state?.selectedPlan]);  // The useEffect depends on selectedPlan in the state
    

    const handleInputChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!bankName) {
            alert('Please select a bank name.');
            return;
        }
    
        try {
            // Ensure the paymentMethod is set to the bankName
            const updatedUserData = { 
                ...userData, 
                paymentMethod: bankName  // Assign bankName to paymentMethod
            };
    
            await api.post('/subscription/transaction', updatedUserData);
            console.log(bankName);
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
                {/* Plan Name Display */}
                <div className="form-group">
                    <label>Selected Plan</label>
                    <input type="text" value={planName} readOnly />
                </div>
                {/* Bank Name Display */}
                <div className="form-group">
                    <label>Bank Name</label>
                    <input type="text" value={bankName} readOnly />
                </div>
                <button type="submit" className="btn btn-success">
                    Update Subscription
                </button>
            </form>
        </div>
    );
};

export default TransactionForm;
