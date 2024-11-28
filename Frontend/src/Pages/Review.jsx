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
            console.error('Review submission error:', error);
            console.error('Error Response:', error.response?.data);
            console.error('Error Status:', error.response?.status);
            setErrorMessage(error.response?.data?.message || 'Failed to submit review. Please try again.');
        }
    };

    return (
        <>
            <NavBarDashboard />
            <div>
                <h2>Review Page</h2>

                {loading ? (
                    <p>Loading reviews...</p>
                ) : (
                    <div>
                        <h3>Reviews</h3>
                        {reviews.length > 0 ? (
                            <ul>
                                {reviews.map((review) => (
                                    <li key={review.reviewId}>
                                        <p><strong>Review:</strong> {review.reviewContent}</p>
                                        <p><strong>Rating:</strong> {review.rating} / 5</p>
                                        <p><em>Created by: User {review.createdBy}</em></p>
                                        <hr />
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No reviews yet. Be the first to review!</p>
                        )}
                    </div>
                )}

                {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

                <div>
                    <h3>Submit a Review</h3>
                    <form onSubmit={handleSubmitReview}>
                        <div>
                            <label htmlFor="newReview">Review:</label>
                            <textarea
                                id="newReview"
                                value={newReview}
                                onChange={(e) => setNewReview(e.target.value)}
                                required
                                rows="4"
                                cols="50"
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="rating">Rating:</label>
                            <select
                                id="rating"
                                value={rating}
                                onChange={(e) => setRating(Number(e.target.value))}
                            >
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <option key={value} value={value}>
                                        {value}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit">Submit Review</button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewPage;
