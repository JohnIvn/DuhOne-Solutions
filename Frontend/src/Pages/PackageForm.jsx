import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import api from '../Api.js';
import '../CSS/SubscriptionPage.css';
import AdminNavDashboard from '../components/AdminDashboard.jsx';

const PackageManager = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newPlan, setNewPlan] = useState({ plan: '', price: '', speed: '', description: '' });
    const [editPlan, setEditPlan] = useState({ Package_id: '', plan: '', price: '', speed: '', description: '' });

    // Modal state
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await api.get('/api/package/plans');
                if (response.status === 200) {
                    setPlans(response.data);
                } else {
                    setError('Failed to load plans.');
                }
            } catch (error) {
                setError('Error fetching plans: ' + error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleCreatePackage = async () => {
        try {
            const response = await api.post('/api/package', newPlan);
            if (response.status === 201) {
                setPlans([...plans, response.data]); // Add new package to the list
                setNewPlan({ plan: '', price: '', speed: '', description: '' }); // Clear form
            }
        } catch (error) {
            setError('Error creating package: ' + error.message);
        }
    };

    const handleUpdatePackage = async () => {
        try {
            const response = await api.put(`/api/package/${editPlan.Package_id}`, editPlan);
            if (response.status === 200) {
                setPlans(prevPlans =>
                    prevPlans.map(plan =>
                        plan.Package_id === editPlan.Package_id ? response.data : plan // Replace the correct plan with updated one
                    )
                );
                setShowModal(false); // Close the modal after updating
                window.location.reload(); // Force reload to fetch and display updated data
            }
        } catch (error) {
            setError('Error updating package: ' + error.message); // Display error message if update fails
        }
    };
    

    const handleDeletePackage = async (id) => {
        try {
            const response = await api.delete(`/api/package/${id}`);
            if (response.status === 200) {
                setPlans(plans.filter(plan => plan.Package_id !== id));
            }
        } catch (error) {
            setError('Error deleting package: ' + error.message);
        }
    };

    if (isLoading) {
        return <div className="text-center">Loading plans...</div>;
    }

    if (error) {
        return <div className="text-center text-danger">{error}</div>;
    }

    return (
        <>
        <AdminNavDashboard />
        <div className="subscription-container">
            <h1 className="text-center">Choose Your Plan</h1>
            <div className="row">
                {plans.map((plan) => (
                    <div key={plan.Package_id} className="col-md-3 plan-box">
                        <h3>{plan.plan}</h3>
                        <p>Speed: {plan.speed}</p>
                        <p>Price: {plan.price}</p>
                        <p>{plan.description}</p>
                        <Button onClick={() => { setEditPlan({ ...plan }); setShowModal(true); }}>Edit</Button>
                        <Button onClick={() => handleDeletePackage(plan.Package_id)}>Delete</Button>
                    </div>
                ))}
            </div>

            <h2>Create a New Package</h2>
            <div className="form-group">
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Plan Name" 
                    value={newPlan.plan} 
                    onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })} 
                />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Price" 
                    value={newPlan.price} 
                    onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })} 
                />
                <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Speed" 
                    value={newPlan.speed} 
                    onChange={(e) => setNewPlan({ ...newPlan, speed: e.target.value })} 
                />
                <textarea 
                    className="form-control" 
                    placeholder="Description" 
                    value={newPlan.description} 
                    onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })} 
                />
                <button onClick={handleCreatePackage} className="btn btn-primary">Create Package</button>
            </div>

            {/* Modal for Editing Package */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Package</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Plan Name" 
                        value={editPlan.plan} 
                        onChange={(e) => setEditPlan({ ...editPlan, plan: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Price" 
                        value={editPlan.price} 
                        onChange={(e) => setEditPlan({ ...editPlan, price: e.target.value })} 
                    />
                    <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Speed" 
                        value={editPlan.speed} 
                        onChange={(e) => setEditPlan({ ...editPlan, speed: e.target.value })} 
                    />
                    <textarea 
                        className="form-control" 
                        placeholder="Description" 
                        value={editPlan.description} 
                        onChange={(e) => setEditPlan({ ...editPlan, description: e.target.value })} 
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                    <Button variant="primary" onClick={handleUpdatePackage}>Update Package</Button>
                </Modal.Footer>
            </Modal>
        </div>
        </>
    );
};

export default PackageManager;
