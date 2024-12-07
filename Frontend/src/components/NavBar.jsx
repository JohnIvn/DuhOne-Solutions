import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Container, Row, Col, Button, Card } from 'react-bootstrap';

const NavBar = () => {
    const [navFixed, setNavFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
          setNavFixed(window.scrollY > 50);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    return (
        <Navbar
            bg="light"
            expand="lg"
            className={`py-3 ${navFixed ? 'fixed-top shadow' : ''}`}
        >
        <Container>
            <Navbar.Brand href="/" className="text-dark">DUHONE</Navbar.Brand>
            <Navbar.Toggle aria-controls="navbar-nav" />
            <Navbar.Collapse id="navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/#overview" className="text-dark">Overview</Nav.Link>
                <Nav.Link href="/#features" className="text-dark">Features</Nav.Link>
                <Nav.Link href="/#examples" className="text-dark">Examples</Nav.Link>
                <Nav.Link href="/#learn-more" className="text-dark">Learn More</Nav.Link>
            </Nav>
            <Nav>
                <Nav.Link href="/signin" className="text-dark">Sign In</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
};

export default NavBar;