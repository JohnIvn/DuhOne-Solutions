import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';
import '../CSS/Homepage.css';
import mobilePhoneImage from '../assets/tech.png'; // Adjust the path as necessary


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

                <h1 className="hero-title">Connecting you to fast, reliable internet and customer care.</h1>
                <p className="hero-description">
                Welcome to our website, your gateway to fast, reliable internet and top-notch customer care. We offer flexible plans to suit your needs and easy access to support for any issues. Enjoy seamless connectivity and peace of mind with our reliable services.                </p>
                    <div className="hero-buttons">
                        <a href="/profile">
                            <button className="primary-btn">My Account</button>
                        </a>
                        <a href="/subscription">
                            <button className="secondary-btn">Available Plans</button>
                        </a>
                        <a href="/review">
                            <button className="third-btn">Contact Us</button>
                        </a>
                    </div>
                </div>
                {/* Add the image on the right side */}
                <div className="hero-image">
                    <img 
                        src={mobilePhoneImage} 
                        alt="Mobile Phone" 
                        className="hero-image-img"
                    />
                </div>
            </section>
            {/* <h2>Home Page</h2>
            <p>{data || 'Loading...'}</p> */}
            <Footer />
        </div>
    );
};

export default HomePage;
