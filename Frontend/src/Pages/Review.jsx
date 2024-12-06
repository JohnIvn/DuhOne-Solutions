import React, { useEffect, useState } from 'react';
import api from '../Api';
import { useNavigate } from 'react-router-dom';
import NavBarDashboard from '../components/NavBarDashboard.jsx';
import Footer from '../components/Footer.jsx';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState('');
    const [rating, setRating] = useState(5);
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

    return (
        <>
            <NavBarDashboard />
            <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', color: '#333'  }}>
                <h2 style={{ textAlign: 'center', color: '#444' }}>Review Page</h2>

                {loading ? (
                    <p style={{ textAlign: 'center' }}>Loading reviews...</p>
                ) : (
                    <div style={{ margin: '20px 0' }}>
                        <h3 style={{ color: '#444' }}>Reviews</h3>
                        {reviews.length > 0 ? (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {reviews.map((review) => (
                                    <li key={review.reviewId} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
                                        <p>
                                            <strong>Review:</strong> {review.reviewContent}
                                        </p>
                                        <p>
                                            <strong>Rating:</strong> {review.rating} / 5
                                        </p>
                                        <p style={{ fontStyle: 'italic', color: '#666' }}>Created by: User {review.createdBy}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p style={{ textAlign: 'center', color: '#666' }}>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                )}

                {errorMessage && <p style={{ color: 'red', textAlign: 'center' }}>{errorMessage}</p>}

                <div style={{ margin: '20px 0', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#fff' }}>
                    <h3 style={{ color: '#444' }}>Submit a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="newReview" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                                Review:
                            </label>
                            <textarea
                                id="newReview"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                required
                                rows="4"
                                cols="50"
                                style={{ width: '100%', padding: '10px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            ></textarea>
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="rating" style={{ display: 'block', marginBottom: '5px', color: '#555' }}>
                                Rating:
                            </label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                                style={{ padding: '5px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            type="submit"
                            style={{
                                backgroundColor: '#28a745',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 15px',
                                fontSize: '16px',
                                cursor: 'pointer',
                                borderRadius: '4px',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseOver={(e) => (e.target.style.backgroundColor = '#218838')}
                            onMouseOut={(e) => (e.target.style.backgroundColor = '#28a745')}
                        >
                            Submit Review
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewPage;
