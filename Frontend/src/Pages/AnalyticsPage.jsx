import React, { useState, useEffect, useCallback } from "react";
import { Button, Dropdown, Spinner, Table, Container } from "react-bootstrap";
import { CheckCircle, Cancel, Block } from '@mui/icons-material';
import { Pie, Bar, Line } from 'react-chartjs-2'; // Add the Line chart import
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import api from "../Api.js";
import "../CSS/AdminDashboard.css";
import AdminNavDashboard from "../components/AdminDashboard.jsx";
import Footer from '../components/Footer.jsx';

// Registering the necessary chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

const AnalyticsPage = () => {
  const [clients, setClients] = useState([]);
  const [analytics, setAnalytics] = useState(null);  // New state for analytics data
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

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/analytics"); // Fetch analytics data from the backend
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();  // Fetch analytics when the component loads
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

  // Line chart data (Client Sign-ups Over Time)
  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],  // Months or any other x-axis data
    datasets: [
      {
        label: 'Client Sign-ups',
        data: [12, 19, 3, 5, 2, 3], // Sample data (replace it with real data)
        fill: false,
        borderColor: '#007bff',
        tension: 0.1,
      },
    ],
  };

  return (
    <>
      <AdminNavDashboard />
      <Container fluid className="admin-dashboard" style={{ backgroundColor: "#051b36", minHeight: "100vh" }}>
        <h1 className="dashboard-title">Analytics Page</h1>

        {/* Filters Section */}

        {/* Analytics Section */}
        <div className="analytics-section mt-4">
          <h3>Analytics</h3>
          {analytics ? (
            <div>
              <div className="statistics">
                <div>Total Revenue: {analytics.totalRevenue}</div>
                <div>Total Users: {analytics.totalUsers}</div>
                <div>Total Admins: {analytics.totalAdmin}</div>
                <div>Total Data Transferred: {analytics.totalDataTransfered} GB</div>
                <div>Total Logins: {analytics.totalLogins}</div>
                <div>Total Signups: {analytics.totalSignUps}</div>
              </div>
              <div className="charts d-flex justify-content-between">
                {/* Pie chart for Client Status Distribution */}
                <div className="pie-chart">
                  <h5>Client Status Distribution</h5>
                  <Pie data={pieData} />
                </div>

                {/* Bar chart for Clients by Plan */}
                <div className="bar-chart">
                  <h5>Clients by Plan</h5>
                  <Bar data={barData} />
                </div>

                {/* Line chart for Client Sign-ups Over Time */}
                <div className="line-chart">
                  <h5>Client Sign-ups Over Time</h5>
                  <Line data={lineData} />
                </div>
              </div>
            </div>
          ) : (
            <div>Loading analytics...</div>
          )}
        </div>

      </Container>

      <Footer />
    </>
  );
};

export default AnalyticsPage;
