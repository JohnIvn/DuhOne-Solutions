import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Spinner, Table, Container, Modal, Form } from "react-bootstrap";
import { CheckCircle, Cancel, Send, Search } from '@mui/icons-material';
import api from "../Api.js";
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from '../components/Footer.jsx';

const Suspended = () => {
  const [clients, setClients] = useState([]);
  const [statusFilter, setStatusFilter] = useState("Suspended");  // Default to Suspended
  const [planFilter, setPlanFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalClientId, setModalClientId] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  const availablePlans = ["Basic", "Standard", "Premium", "Ultimate"];
  const availableStatuses = ["Suspended"]; 
  const availablePaidStatuses = ["True", "False"];

  const calculateEndDate = (subscribeAt) => {
    const subscribeDate = new Date(subscribeAt);
    subscribeDate.setDate(subscribeDate.getDate() + 30);
    return subscribeDate;
  };

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/Admin-Portal/suspended", { params: filters });
      // Check if response.data is an array
      const clientsData = Array.isArray(response.data) ? response.data : [];
      const updatedClients = clientsData.map((client) => ({
        ...client,
        endAT: client.subscribeAt ? calculateEndDate(client.subscribeAt) : null,
      }));
      setClients(updatedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const unsuspendClient = async (clientId) => {
    try {
      const client = clients.find((client) => client.userId === clientId);
      if (client) {
        const newEndDate = calculateEndDate(client.subscribeAt); // Adjust if needed
        await api.put(`/Admin-Portal/${clientId}/status`, {
          status: "Pending",  // Set the status to Pending
          endAt: newEndDate,
        });
        // Re-fetch the updated clients list after updating the status
        await fetchClients({ plan: planFilter, status: "Suspended", paid: paidFilter });
      }
    } catch (error) {
      console.error("Error unsuspending client:", error);
    }
  };

  const handleSendMessage = () => {
    if (modalClientId && customMessage) {
      sendMessage(modalClientId, customMessage);
      setShowModal(false);
      setCustomMessage("");
    } else {
      alert("Please write a message before sending.");
    }
  };

  const handleSearch = () => {
    if (searchTerm) {
      fetchClients({ userId: searchTerm, status: "Suspended" });  
    } else {
      fetchClients({ plan: planFilter, status: "Suspended", paid: paidFilter });  // Default search only for Suspended
    }
  };

  useEffect(() => {
    if (!isInitialLoad) {
      fetchClients({ plan: planFilter, status: "Suspended", paid: paidFilter });  
    } else {
      setIsInitialLoad(false);
    }
  }, [planFilter, statusFilter, paidFilter, fetchClients, isInitialLoad]);

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="admin-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">Suspended Accounts</h1>

        <div className="filters-container d-flex justify-content-between align-items-center">
          <div className="filter-group d-flex">
            <Dropdown onSelect={(e) => setPlanFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{planFilter || "Select Plan"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {availablePlans.map((plan) => (
                  <Dropdown.Item key={plan} eventKey={plan}>
                    {plan}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={(e) => setPaidFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{paidFilter || "Select Paid Status"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {availablePaidStatuses.map((status) => (
                  <Dropdown.Item key={status} eventKey={status}>
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Button
              onClick={() => {
                setPlanFilter("");
                setPaidFilter("");
                setSearchTerm("");
                fetchClients({ status: "Suspended" });  
              }}
              variant="secondary"
              className="reset-button"
            >
              Reset Filters
            </Button>
          </div>

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
                  <th>Name</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Subscribed</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="no-clients">No suspended clients found.</td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.userId} className="client-row">
                      <td>{client.name}</td>
                      <td>{client.plan}</td>
                      <td className={`status-${client.status}`}>{client.status}</td>
                      <td className={`status-${client.paid}`}>{client.paid}</td>
                      <td>{client.subscribeAt ? new Date(client.subscribeAt).toLocaleDateString() : "N/A"}</td>
                      <td>{client.endAT ? new Date(client.endAT).toLocaleDateString() : "N/A"}</td>
                      <td className="action-buttons">
                        {/* New button to unsuspend the client */}
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
