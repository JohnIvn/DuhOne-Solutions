import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/TransactionForm.css';

const TransactionForm = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const [userData, setUserData] = useState(null);
    const [bankName, setBankName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        street: '',
        city: '',
        barangay: '',
        zipCode: '',
    });

    const [errors, setErrors] = useState({
        phoneNumber: '',
        firstName: '',
        lastName: '',
        zipCode: '',
    });

    const [borderColors, setBorderColors] = useState({
        phoneNumber: '',
        firstName: '',
        lastName: '',
        zipCode: '',
    });

    const planName = state?.selectedPlan?.plan || 'No plan selected';

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await api.get('/subscription/transaction');
                const data = response.data;

                console.log('API Response:', data);

                const fetchedBankName = data.bankName || '';
                setUserData({ ...data, plan: state?.selectedPlan || data.plan });
                setBankName(fetchedBankName);
                setFormData({
                    firstName: data.firstName,
                    lastName: data.lastName,
                    email: data.email,
                    phoneNumber: data.phoneNumber,
                    street: data.street,
                    city: data.city,
                    barangay: data.barangay,
                    zipCode: data.zipCode,
                });
            } catch (error) {
                setErrorMessage('Error fetching user data. Please try again later.');
                console.error('Error in fetchUserData:', error);
            }
        };

        fetchUserData();
    }, [state?.selectedPlan]);

    const handleInputChange = (field, value) => {
        setFormData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // Dynamic validation with useEffect
    useEffect(() => {
        const validateFields = () => {
            const newErrors = {};
            const newBorderColors = {};

            // Validate phone number
            if (!/^\d+$/.test(formData.phoneNumber) || formData.phoneNumber.length !== 11) {
                newErrors.phoneNumber = 'Phone number must be numeric and 11 digits.';
                newBorderColors.phoneNumber = 'red';
            } else {
                newBorderColors.phoneNumber = 'green';
            }

            // Validate zip code
            if (!/^\d{4}$/.test(formData.zipCode)) {
                newErrors.zipCode = 'Zip code must be 4 numeric digits.';
                newBorderColors.zipCode = 'red';
            } else {
                newBorderColors.zipCode = 'green';
            }

            // Validate first name
            if (formData.firstName.length < 3 || formData.firstName.length > 30) {
                newErrors.firstName = 'First name must be between 3 and 30 characters.';
                newBorderColors.firstName = 'red';
            } else {
                newBorderColors.firstName = 'green';
            }

            // Validate last name
            if (formData.lastName.length < 3 || formData.lastName.length > 30) {
                newErrors.lastName = 'Last name must be between 3 and 30 characters.';
                newBorderColors.lastName = 'red';
            } else {
                newBorderColors.lastName = 'green';
            }

            setErrors(newErrors);
            setBorderColors(newBorderColors);
        };

        validateFields();
    }, [formData]);

    const validateForm = () => {
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!bankName) {
            alert('Please select a bank name.');
            return;
        }

        if (!validateForm()) {
            alert('Please correct the errors before submitting.');
            return;
        }

        try {
            const updatedUserData = {
                ...userData,
                paymentMethod: bankName,
                ...formData,
            };

            await api.post('/subscription/transaction', updatedUserData);
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
                    <input
                        type="text"
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        className={`form-control ${borderColors.firstName}`}
                    />
                    <small className="form-text text-danger">{errors.firstName}</small>
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        className={`form-control ${borderColors.lastName}`}
                    />
                    <small className="form-text text-danger">{errors.lastName}</small>
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" value={formData.email} readOnly />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        value={formData.phoneNumber || ''}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className={`form-control ${borderColors.phoneNumber}`}
                    />
                    <small className="form-text text-danger">{errors.phoneNumber}</small>
                </div>
                <div className="form-group">
                    <label>Street</label>
                    <input
                        type="text"
                        value={formData.street || ''}
                        onChange={(e) => handleInputChange('street', e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>City</label>
                    <input
                        type="text"
                        value={formData.city || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Barangay</label>
                    <input
                        type="text"
                        value={formData.barangay || ''}
                        onChange={(e) => handleInputChange('barangay', e.target.value)}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Zip Code</label>
                    <input
                        type="text"
                        value={formData.zipCode || ''}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        className={`form-control ${borderColors.zipCode}`}
                    />
                    <small className="form-text text-danger">{errors.zipCode}</small>
                </div>
                <div className="form-group">
                    <label>Selected Plan</label>
                    <input type="text" value={planName} readOnly />
                </div>
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
