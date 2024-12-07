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
                const response = await api.get('/api/package/plans');  
                console.log('API response:', response.data);  

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
            await api.post('/subscription', {
                plan: selectedPlan.plan,  
                package_id: selectedPlan.Package_id,
                price: selectedPlan.price,
            });
    
            console.log('Form submitted successfully.');
            navigate('/subscription/transaction');  
        } catch (error) {
            console.error('Error submitting plan:', error);
            alert('An error occurred while submitting your plan.');
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
            </div>
            <Footer />
        </>
    );
};

export default SubscriptionPage;
