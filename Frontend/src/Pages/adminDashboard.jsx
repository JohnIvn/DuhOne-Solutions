import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Spinner, Table, Container, Modal, Form } from "react-bootstrap";
import { CheckCircle, Cancel, Block, Send, Search } from '@mui/icons-material'; // Added Search icon
import api from "../Api.js";
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from '../components/Footer.jsx';

const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState(""); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // State for Modal
  const [showModal, setShowModal] = useState(false);
  const [modalClientId, setModalClientId] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  const availablePlans = ["Basic", "Standard", "Premium", "Ultimate"];
  const availableStatuses = ["approved", "pending", "denied", "suspended"];
  const availablePaidStatuses = ["True", "False"]; 

  const calculateEndDate = (subscribeAt) => {
    const subscribeDate = new Date(subscribeAt);
    subscribeDate.setDate(subscribeDate.getDate() + 30); 
    return subscribeDate;
  };

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      console.log("Fetching clients with filters:", filters);
      const response = await api.get("/clients", { params: filters });
      console.log("Clients fetched:", response.data);
      const updatedClients = response.data.map((client) => ({
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

  const updateStatus = async (clientId, newStatus) => {
    try {
      const client = clients.find((client) => client.userId === clientId);
      if (client) {
        const newEndDate = calculateEndDate(client.subscribeAt);  
      
        const response = await api.put(`/clients/${clientId}/status`, {
          status: newStatus,  
          endAt: newEndDate,  
        });
        
        console.log("Updated client response:", response.data);
        await fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
      }
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  const sendMessage = async (clientId, message) => {
    try {
      const response = await api.post(`/clients/${clientId}/send-message`, { message });
      console.log("Message sent response:", response.data);
      alert("Message sent successfully!");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleSuspend = (clientId) => {
    updateStatus(clientId, "suspended");
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
      fetchClients({ userId: searchTerm }); // Search for a specific user by userId
    } else {
      fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
    }
  };

  useEffect(() => {
    if (!isInitialLoad) {
      console.log("Filters changed - plan:", planFilter, "status:", statusFilter, "paid:", paidFilter);
      fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
    } else {
      setIsInitialLoad(false);
    }
  }, [planFilter, statusFilter, paidFilter, fetchClients, isInitialLoad]);

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="admin-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">Admin Dashboard</h1>

        <div className="filters-container">
          <Dropdown onSelect={(e) => setPlanFilter(e)} className="filter-dropdown">
            <Dropdown.Toggle>{planFilter || "Select Plan"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {availablePlans.map((plan) => (
                <Dropdown.Item key={plan} eventKey={plan}>
                  {plan}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown onSelect={(e) => setStatusFilter(e)} className="filter-dropdown">
            <Dropdown.Toggle>{statusFilter || "Select Status"}</Dropdown.Toggle>
            <Dropdown.Menu>
              {availableStatuses.map((status) => (
                <Dropdown.Item key={status} eventKey={status}>
                  {status}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          <Dropdown onSelect={(e) => setPaidFilter(e)} className="filter-dropdown">
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
              setStatusFilter("");
              setPaidFilter("");
              setSearchTerm("");
              fetchClients({}); 
            }}
            variant="secondary"
            className="reset-button"
          >
            Reset Filters
          </Button>

          {/* Search Bar */}
          <div className="search-bar-container">
            <Form.Control
              type="text"
              placeholder="Search by User ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
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
                    <td colSpan="7" className="no-clients">No clients found matching your filters</td>
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
                        <Button variant="success" size="sm" onClick={() => updateStatus(client.userId, "approved")}>
                          <CheckCircle />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => updateStatus(client.userId, "denied")}>
                          <Block />
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => handleSuspend(client.userId)}>
                          <Cancel />
                        </Button>
                        <Button variant="info" size="sm" onClick={() => {
                          setModalClientId(client.userId);
                          setShowModal(true);
                        }}>
                          <Send />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </div>

        {/* Finalize and Reset actions outside the table */}
        <div className="finalize-actions">
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
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

export default AdminDashboard;
