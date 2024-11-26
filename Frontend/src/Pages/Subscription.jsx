import React, { useState } from 'react';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';

const SubscriptionPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

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
            const response = await api.post('/subscription', { plan: selectedPlan });
            alert('Subscription request sent successfully!');
            console.log('Response:', response.data);
        } catch (error) {
            alert('Failed to send subscription request. Please try again.');
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
    );
};

export default SubscriptionPage;
