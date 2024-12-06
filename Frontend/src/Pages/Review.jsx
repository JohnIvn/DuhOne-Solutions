import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await api.get('/review');
                setReviews(response.data.reviews || []);
            } catch (error) {
                const status = error.response?.status;
                if (status === 401 || status === 403) {
                    alert('Unauthorized access. Please log in.');
                    navigate('/signin');
                } else if (status === 404) {
                    setErrorMessage('Reviews not found.');
                } else {
                    setErrorMessage('An unexpected error occurred while fetching reviews.');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [navigate]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!newReview.trim()) {
            setErrorMessage('Please write a review before submitting.');
            return;
        }
        try {
            setErrorMessage('');
            const response = await api.post('/review', {
                content: newReview,
                rating,
            });
            alert('Review submitted successfully!');
            setReviews((prevReviews) => [...prevReviews, response.data.review]);
            setNewReview('');
            setRating(5);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || 'Failed to submit review. Please try again.');
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((value) => (
            <span
                key={value}
                style={{
                    cursor: 'pointer',
                    color: value <= (hoverRating || rating) ? '#ffc107' : '#e4e5e9',
                    fontSize: '24px',
                    transition: 'color 0.3s',
                }}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHoverRating(value)}
                onMouseLeave={() => setHoverRating(0)}
            >
                ★
            </span>
        ));
    };

    return (
        <>
            <NavBarDashboard />
            <div
                style={{
                    marginTop:"-15px",
                    padding: '50px',
                    fontFamily: 'Arial, sans-serif',
                    backgroundColor: '#f5f5f5',
                    color: '#333',
                }}
            >
                <div
                    style={{
                        maxWidth: '800px',
                        margin: '0 auto',
                        backgroundColor: '#fff',
                        padding: '30px',
                        borderRadius: '10px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <h2
                        style={{
                            textAlign: 'center',
                            color: '#333',
                            marginBottom: '20px',
                            fontWeight: 'bold',
                        }}
                    >
                        Customer Reviews
                    </h2>

                    {loading ? (
                        <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
                            Loading reviews...
                        </p>
                    ) : (
                        <div style={{ marginBottom: '30px' }}>
                            <h3 style={{ color: '#555', marginBottom: '15px', fontWeight: '600' }}>
                                Recent Reviews
                            </h3>
                            {reviews.length > 0 ? (
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {reviews.map((review) => (
                                        <li
                                            key={review.reviewId}
                                            style={{
                                                marginBottom: '20px',
                                                padding: '15px',
                                                border: '1px solid #ddd',
                                                borderRadius: '8px',
                                                backgroundColor: '#fafafa',
                                            }}
                                        >
                                            <p
                                                style={{
                                                    marginBottom: '10px',
                                                    fontSize: '16px',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                "{review.reviewContent}"
                                            </p>
                                            <p
                                                style={{
                                                    marginBottom: '10px',
                                                    fontSize: '14px',
                                                    color: '#888',
                                                }}
                                            >
                                                <strong>Rating:</strong> {review.rating} / 5
                                            </p>
                                            <p
                                                style={{
                                                    fontStyle: 'italic',
                                                    fontSize: '13px',
                                                    color: '#999',
                                                }}
                                            >
                                                Created by: User {review.createdBy}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p style={{ textAlign: 'center', color: '#666' }}>
                                    No reviews yet. Be the first to review!
                                </p>
                            )}
                        </div>
                    )}

                    {errorMessage && (
                        <p style={{ color: 'red', textAlign: 'center', fontSize: '14px' }}>
                            {errorMessage}
                        </p>
                    )}

                    <div
                        style={{
                            padding: '20px',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            backgroundColor: '#fafafa',
                        }}
                    >
                        <h3 style={{ color: '#444', marginBottom: '15px', fontWeight: '600' }}>
                            Submit Your Review
                        </h3>
                        <form onSubmit={handleSubmitReview}>
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    htmlFor="newReview"
                                    style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        color: '#555',
                                        fontWeight: '500',
                                    }}
                                >
                                    Your Review
                                </label>
                                <textarea
                                    id="newReview"
                                    value={newReview}
                                    onChange={(e) => setNewReview(e.target.value)}
                                    required
                                    rows="5"
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        border: '1px solid #ddd',
                                        borderRadius: '6px',
                                        fontSize: '14px',
                                        lineHeight: '1.5',
                                    }}
                                ></textarea>
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <label
                                    htmlFor="rating"
                                    style={{
                                        display: 'block',
                                        marginBottom: '10px',
                                        color: '#555',
                                        fontWeight: '500',
                                    }}
                                >
                                    Your Rating
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>{renderStars()}</div>
                            </div>
                            <button
                                type="submit"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    backgroundColor: '#007bff',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '12px 20px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    borderRadius: '6px',
                                    transition: 'background-color 0.3s ease',
                                }}
                                onMouseOver={(e) =>
                                    (e.target.style.backgroundColor = '#0056b3')
                                }
                                onMouseOut={(e) =>
                                    (e.target.style.backgroundColor = '#007bff')
                                }
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewPage;
