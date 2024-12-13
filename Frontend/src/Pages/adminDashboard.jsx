import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Spinner, Table, Container, Modal, Form } from "react-bootstrap";
import { CheckCircle, Cancel, Block, Send, Search, Delete } from "@mui/icons-material";
import api from "../Api.js"; 
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from "../components/Footer.jsx";
import { useSocket } from "../socketContext.jsx";

const AdminDashboard = () => {
  const [clients, setClients] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalClientId, setModalClientId] = useState(null);
  const [customMessage, setCustomMessage] = useState("");

  const availablePlans = ["Basic", "Standard", "Premium", "Ultimate"];
  const availableStatuses = ["Active", "Pending", "Inactive"];
  const availablePaidStatuses = ["True", "False"];
  const {socket} = useSocket();
  console.log('socket instance:', socket);

  const calculateEndDate = (subscribeAt) => {
    const subscribeDate = new Date(subscribeAt);
    subscribeDate.setDate(subscribeDate.getDate() + 30);
    return subscribeDate;
  };

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/Admin-Portal", { params: filters });
      const updatedClients = response.data.map((client) => ({
        ...client,
        endAT: client.subscribeAt ? calculateEndDate(client.subscribeAt) : null,
        dataUsage: client.dataUsage || 0, // Initialize data usage if not present
      }));
      setClients(updatedClients);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);


  const handleDelete = async (clientId) => {
    if (window.confirm("Are you sure you want to delete this client?")) {
      try {
        await api.delete(`/Admin-Portal/${clientId}/delete`);
        setClients((prevClients) =>
          prevClients.filter((client) => client.userId !== clientId)
        ); 
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Failed to delete client. Please try again.");
      }
    }
  };
  

  const updateStatus = async (clientId, newStatus) => {
    try {
      const client = clients.find((client) => client.userId === clientId);
      if (client) {
        const newEndDate = calculateEndDate(client.subscribeAt);
        await api.put(`/Admin-Portal/${clientId}/status`, {
          status: newStatus,
          endAt: newEndDate,
        });
        await fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
      }
    } catch (error) {
      console.error("Error updating client status:", error);
    }
  };

  const handleSuspend = (clientId) => {
    updateStatus(clientId, "Suspended");
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

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not initialized yet.");
      return;
    }
  
    const interval = setInterval(async () => {
      try {
        socket.emit('update-data-usage'); // Emit event to update data usage
        await api.put("/Admin-Portal/update-data-usage");
        await fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
      } catch (error) {
        console.error("Error updating data usage:", error);
      }
    }, 15000);
  
    return () => clearInterval(interval); 
  }, [socket, fetchClients, planFilter, statusFilter, paidFilter]);
  

  useEffect(() => {
    if (!isInitialLoad) {
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

            <Dropdown onSelect={(e) => setStatusFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{statusFilter || "Select Status"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {availableStatuses.map((status) => (
                  <Dropdown.Item key={status} eventKey={status}>
                    {status}
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
                  <th>Data Usage (GB)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-clients">No clients found matching your filters</td>
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
                      <td>{client.dataUsage}</td>
                      <td className="action-buttons">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => updateStatus(client.userId, "Active")}
                          title="Activate"
                        >
                          <CheckCircle />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => updateStatus(client.userId, "Inactive")}
                          title="Deactivate"
                        >
                          <Cancel />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
                          onClick={() => handleSuspend(client.userId)}
                          title="Suspend"
                        >
                          <Block />
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(client.userId)}
                          title="Delete"
                        >
                          <Delete />
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default AdminDashboard;
