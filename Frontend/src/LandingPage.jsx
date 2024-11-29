import React from 'react';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import './CSS/LandingPage.css';

const LandingPage = () => {
    return (
        <>
            <NavBar />

            <header className="hero text-white text-center py-5" >
                <h1 className="display-4">Welcome to DuhOne</h1>
            </header>

            <section id="features" className="py-5" >
                <div className="container">
                <div className="row text-center">
                    <div className="col-md-4">
                        <i className="bi bi-graph-up" style={{ fontSize: '50px', color: '#4caf50' }}></i>
                        <h3 className="mt-3">Feature 1</h3>
                        <p>Discover insights and grow with our powerful tools.</p>
                    </div>
                    <div className="col-md-4">
                        <i className="bi bi-gear" style={{ fontSize: '50px', color: '#4caf50' }}></i>
                        <h3 className="mt-3">Feature 2</h3>
                        <p>Customize and optimize your workflow easily.</p>
                    </div>
                    <div className="col-md-4">
                        <i className="bi bi-people" style={{ fontSize: '50px', color: '#4caf50' }}></i>
                        <h3 className="mt-3">Feature 3</h3>
                        <p>Collaborate seamlessly with your team.</p>
                    </div>
                </div>
                </div>
            </section>

            <Footer />
        </>
    );
};

export default LandingPage;