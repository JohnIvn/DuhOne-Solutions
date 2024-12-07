import React, { useEffect, useState } from 'react';
import NavBar from './components/NavBar.jsx';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';

const LandingPage = () => {

  return (
    <>
    <NavBar />
      <section id="overview" className="bg-light py-5">
        <Container>
          <Row className="align-items-center">
            <Col md={6}>
              <h1 className="text-dark">Optimize Your App Performance with DUHONE</h1>
              <p className="lead text-dark">
                Gain end-to-end visibility and actionable insights to enhance your application's performance and ensure seamless user experiences.
              </p>
              <Button variant="dark" style={{ marginRight: "10px" }}>Get Started</Button>              <Button variant="outline-dark">Learn More</Button>
            </Col>
            <Col md={6}>
              <img
                src="https://via.placeholder.com/600x400"
                alt="DUHONE"
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <Container>
          <Row>
            <Col md={4}>
              <Card className="mb-4 border-dark">
                <Card.Body>
                  <Card.Title className="text-dark">Feature 1</Card.Title>
                  <Card.Text className="text-dark">
                    Description of the first feature offered by DUHONE.
                  </Card.Text>
                  <img
                    src="https://via.placeholder.com/200x150"
                    alt="Feature 1"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 border-dark">
                <Card.Body>
                  <Card.Title className="text-dark">Feature 2</Card.Title>
                  <Card.Text className="text-dark">
                    Description of the second feature offered by DUHONE.
                  </Card.Text>
                  <img
                    src="https://via.placeholder.com/200x150"
                    alt="Feature 2"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="mb-4 border-dark">
                <Card.Body>
                  <Card.Title className="text-dark">Feature 3</Card.Title>
                  <Card.Text className="text-dark">
                    Description of the third feature offered by DUHONE.
                  </Card.Text>
                  <img
                    src="https://via.placeholder.com/200x150"
                    alt="Feature 3"
                    className="img-fluid mt-3"
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

        {/* Additional Content in 2x3 Grid Layout */}
<section id="additional-content" className="bg-light py-5">
  <Container>
    <Row className="d-flex justify-content-center">
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">Observe and Secure Hybrid and 3-Tier Applications</h4>
        <p className="text-dark">
          Optimize hybrid and on-prem application performance — and business outcomes — with full-stack observability and AI-powered insights.
        </p>
      </Col>
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">Business Performance Analytics</h4>
        <p className="text-dark">
          Visualize in real time how application, transaction, and end-user data impact your business metrics like conversion and revenue.
        </p>
      </Col>
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">Anomaly Detection and Root Cause Analysis</h4>
        <p className="text-dark">
          Ensure that no issue escapes detection: DUHONE uses AI and ML to baseline normal, detect anomalies, and identify root cause.
        </p>
      </Col>
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">AI Applications and LLM Monitoring</h4>
        <p className="text-dark">
          Monitor compliance, cost, and performance of Gen AI and Large Language Model (LLM) applications.
        </p>
      </Col>
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">Full-context Infrastructure Monitoring</h4>
        <p className="text-dark">
          Monitor and manage hybrid and on-prem environments with a consolidated view of application services and infrastructure correlated with business metrics.
        </p>
      </Col>
      <Col md={6} lg={4} className="mb-4 d-flex flex-column align-items-start">
        <h4 className="text-dark">Flexible Data Collection</h4>
        <p className="text-dark">
          Collect telemetry data with agents or OpenTelemetryTM. Easily instrument applications and manage agents with Smart Agent.
        </p>
      </Col>
    </Row>
  </Container>
</section>


      {/* Footer */}
<footer className="bg-light text-dark py-4">
  <Container>
    <Row>
      <Col md={6}>
        <p>&copy; 2024 DUHONE. All rights reserved.</p>
      </Col>
      <Col md={6} className="text-md-right">
        <div className="d-flex flex-column align-items-md-end">
          {/* Social Media Icons */}
          <div className="mb-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-dark mr-3">
              <i className="fab fa-facebook fa-lg"></i>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-dark mr-3">
              <i className="fab fa-instagram fa-lg"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-dark">
              <i className="fab fa-twitter fa-lg"></i>
            </a>
          </div>
          {/* Footer Text */}
        
        </div>
      </Col>
    </Row>
  </Container>
</footer>

    </>
  );
};

export default LandingPage;