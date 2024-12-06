import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';

const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [userData, setUserData] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
    };

    const fetchUserData = async () => {
        try {
            const response = await api.get('/subscription/transaction');
            setUserData({ ...response.data, plan: selectedPlan || response.data.plan });
            setPaymentMethod(response.data.paymentMethod || '');
        } catch (error) {
            setErrorMessage('Error fetching user data. Please try again later.');
            console.error('Error in fetchUserData:', error);
        }
    };

    const handleSubmit = async () => {
        if (!selectedPlan) {
            alert('Please select a plan before submitting.');
            return;
        }

        setIsLoading(true);

        try {
            await api.post('/subscription', { plan: selectedPlan });
            await fetchUserData();
            setShowModal(true);
        } catch (error) {
            alert('Failed to send subscription request. Please try again.');
            console.error('Error in handleSubmit:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const validateFields = () => {
        const errors = {};
        if (!userData.phoneNumber || !/^\d{10,12}$/.test(userData.phoneNumber)) {
            errors.phoneNumber = 'Phone number must be 10-12 digits.';
        }
        if (!userData.street) {
            errors.street = 'Street is required.';
        }
        if (!userData.city) {
            errors.city = 'City is required.';
        }
        if (!userData.barangay) {
            errors.barangay = 'Barangay is required.';
        }
        if (!userData.zipCode || !/^\d{4}$/.test(userData.zipCode)) {
            errors.zipCode = 'Zip code must be 4 digits.';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleInputChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleModalSubmit = async (e) => {
        e.preventDefault();
        if (!validateFields()) {
            return;
        }
        try {
            await api.post('/subscription/transaction', {
                ...userData,
                paymentMethod,
            });
            alert('Subscription updated successfully!');
            setShowModal(false);
            navigate('/homepage');
        } catch (error) {
            setErrorMessage('Error updating subscription. Please try again.');
            console.error('Error in handleModalSubmit:', error);
        }
    };

    const plans = [
        { id: 1, name: 'Basic', speed: '35 Mbps', price: '₱1699', details: 'Unlimited data' },
        { id: 2, name: 'Standard', speed: '50 Mbps', price: '₱1999', details: 'Unlimited data' },
        { id: 3, name: 'Premium', speed: '75 Mbps', price: '₱2499', details: 'Unlimited data + Free Router' },
        { id: 4, name: 'Ultimate', speed: '100 Mbps', price: '₱2999', details: 'Unlimited data + Free Installation' },
    ];

    return (
        <>
            <NavBarDashboard />
            <div className="subscription-container">
                <h1 className="text-center">Choose Your Plan</h1>
                <div className="row">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`col-md-3 plan-box ${selectedPlan === plan.name ? 'selected' : ''}`}
                            onClick={() => handlePlanSelection(plan.name)}
                        >
                            <h3>{plan.name}</h3>
                            <p>Speed: {plan.speed}</p>
                            <p>Price: {plan.price}</p>
                            <p>{plan.details}</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-4">
                    <button
                        className="btn btn-primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Plan'}
                    </button>
                </div>
            </div>
            <Footer />

            {/* Transaction Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Finalize Subscription</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <p className="error-message text-danger">{errorMessage}</p>}
                    {userData ? (
                        <form onSubmit={handleModalSubmit}>
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
                                    className={`form-control ${validationErrors.phoneNumber ? 'is-invalid' : ''}`}
                                    value={userData.phoneNumber || ''}
                                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                                />
                                <div className="invalid-feedback">{validationErrors.phoneNumber}</div>
                            </div>
                            <div className="form-group">
                                <label>Street</label>
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.street ? 'is-invalid' : ''}`}
                                    value={userData.street || ''}
                                    onChange={(e) => handleInputChange('street', e.target.value)}
                                />
                                <div className="invalid-feedback">{validationErrors.street}</div>
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.city ? 'is-invalid' : ''}`}
                                    value={userData.city || ''}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                />
                                <div className="invalid-feedback">{validationErrors.city}</div>
                            </div>
                            <div className="form-group">
                                <label>Barangay</label>
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.barangay ? 'is-invalid' : ''}`}
                                    value={userData.barangay || ''}
                                    onChange={(e) => handleInputChange('barangay', e.target.value)}
                                />
                                <div className="invalid-feedback">{validationErrors.barangay}</div>
                            </div>
                            <div className="form-group">
                                <label>Zip Code</label>
                                <input
                                    type="text"
                                    className={`form-control ${validationErrors.zipCode ? 'is-invalid' : ''}`}
                                    value={userData.zipCode || ''}
                                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                                />
                                <div className="invalid-feedback">{validationErrors.zipCode}</div>
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
                            <Button type="submit" variant="success" className="mt-3">
                                Update Subscription
                            </Button>
                        </form>
                    ) : (
                        <p>Loading user data...</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default SubscriptionPage;
