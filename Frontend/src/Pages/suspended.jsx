import React, { useState, useEffect, useCallback } from "react";
import { Button, Spinner, Table, Container, Modal, Form } from "react-bootstrap";
import { CheckCircle, Search } from '@mui/icons-material';
import api from "../Api.js"; // Ensure API has methods to interact with backend
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from '../components/Footer.jsx';

const Suspended = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [customMessage, setCustomMessage] = useState("");
  const [selectedClientId, setSelectedClientId] = useState(null);

  // Fetch clients from backend
  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/suspended");
      const data = Array.isArray(response.data) ? response.data : [];
      if (data.length === 0) {
        setClients([]); // Set empty array if no clients are found
        return []; // Return empty array if no suspended clients
      } else {
        setClients(data); // Set the client data if found
        return data; // Return the actual data
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
      setClients([]); // Handle error case by setting empty data
      return []; // Return empty array in case of an error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch initial data on mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Fetch clients again after unsuspending
  const unsuspendClient = async (userId) => {
    try {
      // Use template literal to dynamically insert the userId
      await api.put(`/suspended/unsuspend/${userId}`); // Pass the userId directly in the URL
      fetchClients(); // Fetch clients again after unsuspending
    } catch (error) {
      console.error("Error unsuspending client:", error);
    }
  };

  // Handle search
  const handleSearch = async () => {
    fetchClients({
      status: "Suspended",
      userId: searchTerm,
    });
  };

  // Handle sending custom messages
  const handleSendMessage = async () => {
    if (!selectedClientId) return;
    try {
      await api.post(`/clients/${selectedClientId}/message`, { message: customMessage });
      setShowModal(false);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="admin-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">Suspended Accounts</h1>

        <div className="filters-container d-flex justify-content-between align-items-center">
          {/* Search Bar */}
          <div className="search-bar-container d-flex align-items-center">
            <Form.Control
              type="text"
              placeholder="Search by User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input me-2"
            />
            <Button variant="primary" onClick={handleSearch} className="search-button">
              <Search />
            </Button>
          </div>
        </div>

        <div className="clients-section">
          {loading ? (
            <div className="loading-spinner">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Table bordered hover variant="dark" className="clients-table">
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="no-clients">No suspended clients found.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.userId} className="client-row">
                      <td>{client.userId}</td>
                      <td>{client.firstName} {client.lastName}</td>
                      <td>{client.email}</td>
                      <td className={`status-${client.status}`}>{client.status}</td>
                      <td className="action-buttons">
                        <Button variant="success" size="sm" onClick={() => unsuspendClient(client.userId)}>
                          <CheckCircle /> Unsuspend
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="message">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSendMessage}>Send</Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default Suspended;
