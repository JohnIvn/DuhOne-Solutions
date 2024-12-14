import React, { useState } from "react";
import { Modal, Button, Form, Alert, Spinner } from "react-bootstrap";
import { Add, Email } from "@mui/icons-material";
import api from "../Api.js"; 

const CreateSubscriptionModal = ({ showModal, setShowModal, fetchClients }) => {
  const [userId, setUserId] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const availablePlans = ["Basic", "Standard", "Premium", "Ultimate"];

  const handleCreateSubscription = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setResponseMessage("");

    try {
      if (!userId || !plan) {
        setErrorMessage("User ID and plan are required fields.");
        setLoading(false);
        return;
      }

      const response = await api.post("/Admin-Portal/createSubscription", { userId, plan });
      
      if (response.status === 201) {
        setResponseMessage("Subscription created successfully!");
        fetchClients();  // Reload clients after creation
        setShowModal(false);  // Close modal after success
      } else {
        setErrorMessage(response.data.message);
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating the subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create Subscription</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleCreateSubscription}>
          <Form.Group controlId="userId">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User Email"
              value={Email}
              onChange={(e) => setUserId(e.target.value)}
              required
            />
          </Form.Group>
          
          <Form.Group controlId="plan">
            <Form.Label>Select Plan</Form.Label>
            <Form.Control
              as="select"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              required
            >
              <option value="">Choose a plan</option>
              {availablePlans.map((planOption) => (
                <option key={planOption} value={planOption}>
                  {planOption}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {errorMessage && <Alert variant="danger" className="mt-2">{errorMessage}</Alert>}
          {responseMessage && <Alert variant="success" className="mt-2">{responseMessage}</Alert>}
          
          <Button variant="primary" type="submit" disabled={loading} className="mt-3 w-100">
            {loading ? <Spinner animation="border" size="sm" /> : <Add />} Create Subscription
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateSubscriptionModal;
