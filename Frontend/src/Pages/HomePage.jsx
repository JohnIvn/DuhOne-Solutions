import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Home Page</h2>
            <p>{data || 'Loading...'}</p>
        </div>
    );
};

export default HomePage;
