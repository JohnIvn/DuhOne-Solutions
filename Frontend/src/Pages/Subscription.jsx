import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SubscriptionPage = () => {
    const [plans, setPlans] = useState([]); // State to hold plans
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const navigate = useNavigate();

    // Fetch the plans from the backend API
    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/package/plans'); // Fetch plans from backend
                console.log('API response:', response.data); // Log the response for debugging

                if (response.status === 200) {
                    setPlans(response.data); // Set the plans data
                } else {
                    showSnackbar('Failed to load plans.', 'error');
                }
            } catch (error) {
                console.error('Error fetching plans:', error);
                showSnackbar('An error occurred while loading plans.', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    // Handle plan selection
    const handlePlanSelection = (plan) => {
        console.log('Selected plan:', plan); // Debugging log
        setSelectedPlan(plan); // Set the entire plan object
    };

    // Show Snackbar
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    // Close Snackbar
    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbar({ ...snackbar, open: false });
    };

    // Check balance after plan submission
    const checkBalanceBeforeSubmit = async (planPrice) => {
        try {
            const response = await api.post('/subscription/check-balance', { price: planPrice });
            console.log('Balance check response:', response.data);
    
            if (response.status === 200 && response.data.balance >= planPrice) {
                // If balance is sufficient, navigate to the transaction page
                navigate('/subscription/transaction', { state: { selectedPlan } });
            } else {
                // If balance is insufficient, show the error message
                showSnackbar(response.data.message || 'Insufficient balance. Please top up your account.', 'error');
            }
        } catch (error) {
            console.error('Error checking balance:', error);
            if (error.response) {
                // If there's a response from the server, handle the error
                showSnackbar(error.response.data.message || 'An error occurred while checking balance. Please try again later.', 'error');
            } else {
                // Handle any other errors, such as network issues
                showSnackbar('Network error. Please try again later.', 'error');
            }
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
                        onClick={() => checkBalanceBeforeSubmit(selectedPlan?.price)}
                        disabled={isLoading || !selectedPlan}
                    >
                        {isLoading ? 'Submitting...' : 'Submit Plan'}
                    </button>
                </div>
            </div>
            <Footer />
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default SubscriptionPage;
