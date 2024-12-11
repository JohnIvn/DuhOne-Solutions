import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SubscriptionPage = () => {
    const [plans, setPlans] = useState([]);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
    const [modalOpen, setModalOpen] = useState(false);
    const [currentSubscription, setCurrentSubscription] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/api/package/plans');
                if (response.status === 200) {
                    setPlans(response.data);
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

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbar({ ...snackbar, open: false });
    };

    const checkBalanceBeforeSubmit = async (planPrice) => {
        try {
            const response = await api.post('/subscription/check-balance', { price: planPrice });
            if (response.status === 200 && response.data.balance >= planPrice) {
                checkUserSubscription(); // Check for an existing subscription before proceeding
            } else {
                showSnackbar(response.data.message || 'Insufficient balance. Please top up your account.', 'error');
            }
        } catch (error) {
            if (error.response) {
                showSnackbar(error.response.data.message || 'An error occurred while checking balance.', 'error');
            } else {
                showSnackbar('Network error. Please try again later.', 'error');
            }
        }
    };

    const checkUserSubscription = async () => {
        try {
            const response = await api.get('/subscription/check-subscription');
            if (response.status === 200 && response.data.subscription) {
                setCurrentSubscription(response.data.subscription);
                setModalOpen(true); // Open the modal
            } else {
                navigate('/subscription/transaction', { state: { selectedPlan } });
            }
        } catch (error) {
            console.error('Error checking subscription:', error);
            showSnackbar('An error occurred while checking subscription.', 'error');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
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

            {/* Modal for existing subscription */}
            <Modal
                open={modalOpen}
                onClose={closeModal}
                aria-labelledby="subscription-modal-title"
                aria-describedby="subscription-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        bgcolor: 'background.paper',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: '8px',
                    }}
                >
                    <h2 id="subscription-modal-title">Existing Subscription</h2>
                    <p id="subscription-modal-description">
                        You are already subscribed to the <strong>{currentSubscription?.plan}</strong> plan.
                        Please cancel your current subscription before selecting a new plan.
                    </p>
                    <div className="text-center mt-3">
                        <button className="btn btn-secondary" onClick={closeModal}>
                            Close
                        </button>
                    </div>
                </Box>
            </Modal>
        </>
    );
};

export default SubscriptionPage;
