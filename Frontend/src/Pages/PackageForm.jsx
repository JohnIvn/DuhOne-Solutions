import React, { useState, useEffect } from 'react';
import api from '../Api.js'; 
import '../CSS/SubscriptionPage.css';

const PackageManager = () => {
    const [plans, setPlans] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [newPlan, setNewPlan] = useState({ plan: '', price: '', speed: '', description: '' });
    const [editPlan, setEditPlan] = useState({ Package_id: '', plan: '', price: '', speed: '', description: '' });
    
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
        console.log("Editing package with ID:", editPlan.Package_id); // Log the correct ID

        try {
            const response = await api.put(`/api/package/${editPlan.Package_id}`, editPlan);
            if (response.status === 200) {
                setPlans(prevPlans => 
                    prevPlans.map(plan => 
                        plan.Package_id === editPlan.Package_id ? response.data : plan // Replace the correct plan with updated one
                    )
                );
                setEditPlan({ Package_id: '', plan: '', price: '', speed: '', description: '' }); // Clear form
                $('#editModal').modal('hide'); // Close the modal after updating
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
        <div className="subscription-container">
            <h1 className="text-center">Choose Your Plan</h1>
            <div className="row">
                {plans.map((plan) => (
                    <div key={plan.Package_id} className="col-md-3 plan-box">
                        <h3>{plan.plan}</h3>
                        <p>Speed: {plan.speed}</p>
                        <p>Price: {plan.price}</p>
                        <p>{plan.description}</p>
                        <button onClick={() => setEditPlan({ ...plan })} data-bs-toggle="modal" data-bs-target="#editModal">Edit</button>
                        <button onClick={() => handleDeletePackage(plan.Package_id)}>Delete</button>
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
            <div className="modal fade" id="editModal" tabIndex="-1" aria-labelledby="editModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="editModalLabel">Edit Package</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
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
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" onClick={handleUpdatePackage} className="btn btn-primary">Update Package</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackageManager;
