import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';
import '../CSS/Homepage.css';

const HomePage = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('/homepage');
                setData(response.data.message || 'Welcome to the homepage!');
            } catch (error) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    alert('Unauthorized access. Please log in.');
                    navigate('/signin');
                } else if (status === 404) {
                    alert('The requested resource was not found.');
                    navigate('/signin');
                } else {
                    alert('An unexpected error occurred while fetching data.');
                }
            }
        };
        fetchData();
    }, [navigate]);

    return (
        <div className='bgcolor'>
            <NavBarDashboard />
            <section className="hero">
                <div className="hero-content">

                <h1 className="hero-title">Quickly discover your IP address with our easy-to-use website.</h1>
                <p className="hero-description">
                Our website allows you to quickly view you current internet status. Whether you're managing your network or just need to know your online identity, our tool provides instant results with no hassle. It's the simplest way to get your IP information whenever you need it.
                </p>
                <div className="hero-buttons">
                    <button className="primary-btn">My Account</button>
                    <button className="secondary-btn">Available Plans</button>
                    <button className="third-btn">Contact Us</button>
                </div>
                </div>
            </section>
            {/* <h2>Home Page</h2>
            <p>{data || 'Loading...'}</p> */}
            <Footer />
        </div>
    );
};

export default HomePage;
