import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';

const SubscriptionPage = () => {
    const [selectedPrice, setSelectedPrice] = useState(null);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
    };

    const handleSubmit = async () => {
        if (!selectedPlan) {
            alert('Please select a plan before submitting.');
            return;
        }
    
        setIsLoading(true);
    
        try {
            // Extract and convert the price as before
            const selectedPlanDetails = plans.find(plan => plan.name === selectedPlan);
            if (!selectedPlanDetails) {
                throw new Error('Selected plan details not found.');
            }
            const priceString = selectedPlanDetails.price.replace('₱', '').replace(',', '');
            const price = parseFloat(priceString);
    
            if (isNaN(price)) {
                throw new Error('Invalid price format.');
            }
    
            const updatePaymentResponse = await api.post('/subscription/updatePayment', {
                price,
            });
    
            if (updatePaymentResponse.status === 200) {
                const response = await api.post('/subscription', {
                    plan: selectedPlan,
                    price,
                });
    
                alert('Plan selected! Proceeding to finalize subscription.');
                navigate('/subscription/transaction', { state: { selectedPlan } });
            } else {
                alert('Failed to update payment. Please check your balance.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.error('Error in handleSubmit:', error);
        } finally {
            setIsLoading(false);
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
        </>
    );
};

export default SubscriptionPage;
