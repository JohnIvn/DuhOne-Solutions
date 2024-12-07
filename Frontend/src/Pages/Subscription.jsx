import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';

const SubscriptionPage = () => {
    const [plans, setPlans] = useState([]);  // State to hold plans
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch the plans from the backend API
    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/package/plans');  // Fetch plans from backend
                console.log('API response:', response.data);  // Log the response for debugging

                if (response.status === 200) {
                    setPlans(response.data);  // Set the plans data
                } else {
                    alert('Failed to load plans.');
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
                alert('An error occurred while loading plans.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Handle plan selection
    const handlePlanSelection = (plan) => {
        console.log('Selected plan:', plan);  // Debugging log
        setSelectedPlan(plan);  // Set the entire plan object
    };

    // Handle form submission
    const handleSubmit = async () => {
        console.log('Form submission started.');

        if (!selectedPlan) {
            alert('Please select a plan before submitting.');
            return;
        }

        setIsLoading(true);
        console.log('Loading state set to true.');

        try {
            let price = selectedPlan.price;

            // If price is a string with currency symbol, remove it
            if (typeof price === 'string') {
                console.log('Price is a string. Removing currency symbol.');
                price = price.replace('₱', '').replace(',', '');
            }

            // Ensure price is a valid number
            price = parseFloat(price);

            console.log('Converted price:', price);

            if (isNaN(price)) {
                throw new Error('Invalid price format.');
            }

            console.log('Making API request to update payment with price:', price);
            const updatePaymentResponse = await api.post('/subscription/updatePayment', {
                price,
            });

            console.log('Update payment response:', updatePaymentResponse);

            if (updatePaymentResponse.status === 200) {
                console.log('Payment update successful, making subscription request.');
                const response = await api.post('/subscription', {
                    package_id: selectedPlan.Package_id,
                    price,
                    plan: selectedPlan.plan,
                });
                console.log(selectedPlan);
                console.log('Subscription response:', response);
                alert('Plan selected! Proceeding to finalize subscription.');
                console.log('Navigating to /subscription/transaction');
                navigate('/subscription/transaction', { state: { selectedPlan } });
            } else {
                alert('Failed to update payment. Please check your balance.');
            }
        } catch (error) {
            alert('An error occurred. Please try again.');
            console.error('Error in handleSubmit:', error);
        } finally {
            setIsLoading(false);
            console.log('Loading state set to false.');
        }
    };

    return (
        <>
            <NavBarDashboard />
            <div className="subscription-container">
                <h1 className="text-center">Choose Your Plan</h1>
                <div className="row">
                    {plans.map((plan) => (
                        <div
                            key={plan.Package_id || `${plan.name}-${plan.speed}`} 
                            className={`col-md-3 plan-box ${selectedPlan?.Package_id === plan.Package_id ? 'selected' : ''}`}  
                            onClick={() => handlePlanSelection(plan)}
                        >
                            <h3>{plan.plan}</h3>
                            <p>Speed: {plan.speed}</p>
                            <p>Price: {plan.price}</p>
                            <p>{plan.description}</p>
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
                {/* <div className="text-center mt-4">
                    <h3>Currently selected plan: {selectedPlan ? selectedPlan.plan : 'None'}</h3>
                </div> */}
            </div>
            <Footer />
        </>
    );
};

export default SubscriptionPage;