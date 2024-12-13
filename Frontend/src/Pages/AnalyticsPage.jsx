import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Spinner, Table, Container, Modal, Form } from "react-bootstrap";
import { CheckCircle, Cancel, Block } from '@mui/icons-material';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from "../Api.js";
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from '../components/Footer.jsx';

// Registering the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
  const [clients, setClients] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [paidFilter, setPaidFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const fetchClients = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const response = await api.get("/Admin-Portal", { params: filters });
      setClients(response.data);
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isInitialLoad) {
      fetchClients({ plan: planFilter, status: statusFilter, paid: paidFilter });
    } else {
      setIsInitialLoad(false);
    }
  }, [planFilter, statusFilter, paidFilter, fetchClients, isInitialLoad]);

  // Pie chart data (Client status breakdown)
  const statusData = clients.reduce(
    (acc, client) => {
      if (client.status === "Active") acc.active++;
      else if (client.status === "Pending") acc.pending++;
      else if (client.status === "Inactive") acc.inactive++;
      return acc;
    },
    { active: 0, pending: 0, inactive: 0 }
  );

  const pieData = {
    labels: ['Active', 'Pending', 'Inactive'],
    datasets: [{
      data: [statusData.active, statusData.pending, statusData.inactive],
      backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
    }],
  };

  // Bar chart data (Clients by Plan)
  const planData = clients.reduce(
    (acc, client) => {
      if (client.plan === "Basic") acc.basic++;
      else if (client.plan === "Standard") acc.standard++;
      else if (client.plan === "Premium") acc.premium++;
      else if (client.plan === "Ultimate") acc.ultimate++;
      return acc;
    },
    { basic: 0, standard: 0, premium: 0, ultimate: 0 }
  );

  const barData = {
    labels: ['Basic', 'Standard', 'Premium', 'Ultimate'],
    datasets: [{
      label: 'Clients by Plan',
      data: [planData.basic, planData.standard, planData.premium, planData.ultimate],
      backgroundColor: '#007bff',
    }],
  };

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="admin-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">Analytics Page</h1>

        {/* Filters Section */}
        <div className="filters-container d-flex justify-content-between align-items-center">
          <div className="filter-group d-flex">
            {/* Filter dropdowns */}
            <Dropdown onSelect={(e) => setPlanFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{planFilter || "Select Plan"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {["Basic", "Standard", "Premium", "Ultimate"].map((plan) => (
                  <Dropdown.Item key={plan} eventKey={plan}>
                    {plan}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={(e) => setStatusFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{statusFilter || "Select Status"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {["Active", "Pending", "Inactive"].map((status) => (
                  <Dropdown.Item key={status} eventKey={status}>
                    {status}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown onSelect={(e) => setPaidFilter(e)} className="filter-dropdown me-2">
              <Dropdown.Toggle>{paidFilter || "Select Paid Status"}</Dropdown.Toggle>
              <Dropdown.Menu>
                {["True", "False"].map((status) => (
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
                fetchClients({});
              }}
              variant="secondary"
              className="reset-button"
            >
              Reset Filters
            </Button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section mt-4">
          <h3>Analytics</h3>
          <div className="charts d-flex justify-content-between">
            {/* Pie chart */}
            <div className="pie-chart">
              <h5>Client Status Distribution</h5>
              <Pie data={pieData} />
            </div>

            {/* Bar chart */}
            <div className="bar-chart">
              <h5>Clients by Plan</h5>
              <Bar data={barData} />
            </div>
          </div>
        </div>

        {/* Clients Table Section */}
        <div className="clients-section mt-4">
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
                    <tr key={client.userId}>
                      <td>{client.name}</td>
                      <td>{client.plan}</td>
                      <td>{client.status}</td>
                      <td>{client.paid}</td>
                      <td>{client.subscribeAt ? new Date(client.subscribeAt).toLocaleDateString() : "N/A"}</td>
                      <td>{client.endAT ? new Date(client.endAT).toLocaleDateString() : "N/A"}</td>
                      <td>
                        <Button variant="success" size="sm" onClick={() => updateStatus(client.userId, "Active")}>
                          <CheckCircle />
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => updateStatus(client.userId, "Deactive")}>
                          <Cancel />
                        </Button>
                        <Button variant="warning" size="sm" onClick={() => handleSuspend(client.userId)}>
                          <Block />
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

      <Footer />
    </>
  );
};

export default AnalyticsPage;