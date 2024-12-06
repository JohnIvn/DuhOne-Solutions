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
        <div className="homepage-container">
            <NavBarDashboard />
            
            {/* Hero Section */}
            <div className='back'>
            <section className="hero">
                <div className="hero-content">
                    <h1 className="hero-title">Fast, Reliable Internet with Superior Customer Support</h1>
                    <p className="hero-description">
                        Experience seamless connectivity and exceptional service with our flexible internet plans designed to meet your needs. Whether at home or on the go, we’ve got you covered.
                    </p>
                    <div className="hero-buttons">
                        <a href="/profile">
                            <button className="btn primary-btn">My Account</button>
                        </a>
                        <a href="/subscription">
                            <button className="btn secondary-btn">Available Plans</button>
                        </a>
                        <a href="/review">
                            <button className="btn third-btn">Contact Us</button>
                        </a>
                    </div>
                </div>
                <div className="hero-image">
                    <img 
                        src={mobilePhoneImage} 
                        alt="Mobile Phone" 
                        className="hero-image-img"
                    />
                </div>
            </section>
            </div>

            {/* Key Features Section */}
            <section className="features">
                <h2 className="section-title">Why Choose Us?</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <h3>Fast Speeds</h3>
                        <p>Enjoy blazing-fast internet speeds that ensure you stay connected to what matters most. From streaming to gaming, we’ve got the bandwidth to support your needs.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Reliable Connectivity</h3>
                        <p>Our network is built with reliability in mind, providing you with a stable connection 24/7. Say goodbye to outages and slowdowns.</p>
                    </div>
                    <div className="feature-item">
                        <h3>24/7 Support</h3>
                        <p>Our customer support team is available around the clock to help you with any issues. We prioritize your satisfaction and work hard to provide the best service.</p>
                    </div>
                    <div className="feature-item">
                        <h3>Secure & Safe</h3>
                        <p>We use the latest security protocols to ensure your data is always protected. You can browse and work with peace of mind.</p>
                    </div>
                </div>
            </section>

            {/* News Links Section */}
            <div className='news'>
            <section className="news-links">
                <center><h2 className="section-title2">Latest News</h2></center>
                <div className="news-links-grid">
                    <div className="news-link-item">
                        <a href="https://www.cnbc.com/2024/12/04/spotify-wrapped-is-out-heres-who-topped-the-2024-streaming-charts.html" target="_blank" rel="noopener noreferrer">
                            <img src="https://image.cnbcfm.com/api/v1/image/107404024-1713547941929-gettyimages-2147923562-AFP_34PT2HG.jpeg?v=1713547995&w=600&h=300&ffmt=webp&vtcrop=y" alt="News 1" className="news-link-image" />
                        </a>
                    </div>
                    <div className="news-link-item">
                        <a href="https://www.cnbc.com/2024/12/04/can-the-uk-compete-with-america-as-a-global-crypto-hub.html" target="_blank" rel="noopener noreferrer">
                            <img src="https://image.cnbcfm.com/api/v1/image/104927017-GettyImages-897614888.jpg?v=1682689581&w=1480&h=833&ffmt=webp&vtcrop=y" alt="News 2" className="news-link-image" />
                        </a>
                    </div>
                    <div className="news-link-item">
                        <a href="https://www.cnbc.com/2024/12/03/chinas-ai-balancing-act-beating-the-us-but-keeping-control-of-tech.html" target="_blank" rel="noopener noreferrer">
                            <img src="https://image.cnbcfm.com/api/v1/image/108032405-1726051561764-gettyimages-1480914045-usa-view2.jpeg?v=1732885047&w=1480&h=833&ffmt=webp&vtcrop=y" alt="News 3" className="news-link-image" />
                        </a>
                    </div>
                </div>
            </section>
            </div>

            {/* Call to Action Section */}
            <section className="cta">
                <h2 className="section-title">Get Started Today</h2>
                <p className="cta-description">Ready to experience fast, reliable internet? Choose a plan that fits your needs and start enjoying seamless connectivity today!</p>
                <a href="/subscription">
                    <button className="btn primary-btn">View Plans</button>
                </a>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HomePage;
