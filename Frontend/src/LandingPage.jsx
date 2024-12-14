import React from "react";
import NavBar from "./components/NavBar.jsx";
import { Container, Row, Col, Button, Card } from "react-bootstrap";

const LandingPage = () => {
  return (
    <>
      <NavBar />

      {/* Overview Section */}
      <section
        id="overview"
        style={{
          backgroundColor: "#051b36",
          color: "white",
          padding: "250px 0",
        }}
      >
        <Container>
          <Row className="align-items-center">
            <Col md={6} style={{ marginLeft: "-10%" }}>
              <h1 style={{ fontWeight: "bold" }}>Optimize Your App Performance with <span style={{ color: "#62a2f5" }}>DUHONE</span></h1>
              <p className="lead">
                Gain end-to-end visibility and actionable insights to enhance your application's performance and ensure seamless user experiences.
              </p>
              <Button variant="light" style={{ marginRight: "10px" }}>
                Get Started
              </Button>
              <Button variant="outline-light">Learn More</Button>
            </Col>
            <Col md={6} style={{ position: "absolute", marginLeft: "35%" }}>
              <img
                src="https://www.cnet.com/a/img/resize/121aeb7de56ee0fa73d60ce86c048cf3d1ef43e6/hub/2024/02/29/5b5a30c7-7249-445a-8631-c6581dd169ce/gettyimages-1458178574.jpg?auto=webp&fit=crop&height=675&width=1200"
                alt="DUHONE"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section
        id="features"
        style={{
          backgroundColor: "#0f4c75",
          padding: "100px 0",
        }}
      >
        <Container>
          <Row>
            <Col md={4}>
              <Card className="mb-4" style={{ border: "none", backgroundColor: "#fff", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "bold" }}>Flexible Payment Options</Card.Title>
                  <Card.Text>
                    Pay your bills effortlessly with multiple payment methods.
                  </Card.Text>
                  <img
                    src="https://cdn.shopify.com/s/files/1/0070/7032/articles/payment_options.png?v=1729609990"
                    alt="Feature 1"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4" style={{ border: "none", backgroundColor: "#fff", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "bold" }}>Ultra-Fast Internet Plans</Card.Title>
                  <Card.Text>
                    Explore high-speed internet plans designed for seamless streaming and uninterrupted gaming.
                  </Card.Text>
                  <img
                    src="https://oasisbroadband.net/wp-content/uploads/2020/07/Oasis-Broadband-Internet-Speeds-Use.jpg"
                    alt="Feature 2"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4" style={{ border: "none", backgroundColor: "#fff", boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)" }}>
                <Card.Body>
                  <Card.Title style={{ fontWeight: "bold" }}>No Hidden Fees</Card.Title>
                  <Card.Text>
                    Enjoy transparent pricing with no unexpected charges—what you see is what you pay.
                  </Card.Text>
                  <img
                    src="https://t4.ftcdn.net/jpg/06/41/08/91/360_F_641089161_nYKzQwFBIUvaRkC3aOVX9d2t62oEiqSf.jpg"
                    alt="Feature 3"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Additional Content Section */}
      <section
        id="additional-content"
        style={{
          backgroundColor: "#62a2f5",
          color: "white",
          padding: "200px 0",
        }}
      >
        <Container>
          <Row>
            <Col md={4}>
              <h4 style={{ fontWeight: "bold" }}>Observe and Secure Hybrid and 3-Tier Applications</h4>
              <p>
                Optimize hybrid and on-prem application performance and business outcomes with full-stack observability and AI-powered insights.
              </p>
            </Col>
            <Col md={4}>
              <h4 style={{ fontWeight: "bold" }}>Business Performance Analytics</h4>
              <p>
                Visualize in real-time how application, transaction, and end-user data impact your business metrics like conversion and revenue.
              </p>
            </Col>
            <Col md={4}>
              <h4 style={{ fontWeight: "bold" }}>Anomaly Detection and Root Cause Analysis</h4>
              <p>
                Ensure no issue escapes detection: DUHONE uses AI to baseline normal, detect anomalies, and identify root causes.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Section */}
      <footer
        style={{
          backgroundColor: "#495057",
          color: "white",
          padding: "20px 0",
        }}
      >
        <Container>
          <Row>
            <Col md={6}>
              <p>&copy; 2024 <span style={{ fontWeight: "bold" }}>DUHONE</span>. All rights reserved.</p>
            </Col>
            <Col md={6} className="text-right">
              <p>Contact Us: <a href="mailto:info@duhone.com" style={{ color: "#fff", fontWeight: "bold" }}>duhonesolutions@gmail.com</a></p>
            </Col>
          </Row>
        </Container>
      </footer>
    </>
  );
};

export default LandingPage; 