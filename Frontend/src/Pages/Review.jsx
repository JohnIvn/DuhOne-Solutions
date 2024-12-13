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
    const [sortOrder, setSortOrder] = useState('newest');
    const [filterRating, setFilterRating] = useState(null);
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

    const handleSort = (order) => {
        setSortOrder(order);
        const sortedReviews = [...reviews].sort((a, b) => {
            if (order === 'newest') {
                return new Date(b.createdAt) - new Date(a.createdAt);
            } else {
                return new Date(a.createdAt) - new Date(b.createdAt);
            }
        });
        setReviews(sortedReviews);
    };

    const handleRatingFilter = (rating) => {
        setFilterRating(rating);
    };

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
                    fontSize: '40px',
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

    const filteredReviews = filterRating
        ? reviews.filter((review) => review.rating === filterRating)
        : reviews;

    // Responsive styles
    const containerStyle = {
        marginTop: '-15px',
        padding: '50px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#f5f5f5',
        color: '#333',
    };

    const contentStyle = {
        display: 'flex',
        gap: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        flexWrap: 'wrap', // Allow wrapping on smaller screens
    };

    const sectionStyle = {
        flex: 1,
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#fafafa',
        minWidth: '300px', // Minimum width for better responsiveness
    };

    return (
        <>
            <NavBarDashboard />
            <div style={containerStyle}>
                <div style={contentStyle}>
                    {/* Submit Your Review Section */}
                    <div style={sectionStyle}>
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
                            <label
                                htmlFor="choosePlan"
                                style={{
                                    display: 'block',
                                    marginBottom: '10px',
                                    color: '#555',
                                    fontWeight: '500',
                                }}
                            >
                                Choose your plan
                            </label>
                            <div
                                style={{
                                    marginBottom: '20px',
                                    display: 'flex',
                                    gap: '20px',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap', // Allow wrapping on smaller screens
                                }}
                            >
                                {['Basic', 'Standard', 'Premium', 'Ultimate'].map((plan) => (
                                    <button
                                        key={plan}
                                        style={{
                                            padding: '12px 20px',
                                            backgroundColor: '#007bff',
                                            color: '#fff',
                                            border: 'none',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '16px',
                                            fontWeight: '600',
                                            transition: 'background-color 0.3s ease',
                                        }}
                                        onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                                        onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                                    >
                                        {plan}
                                    </button>
                                ))}
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
                                <div style={{ display: 'flex', gap: '20px' }}>{renderStars()}</div>
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
                                onMouseOver={(e) => (e.target.style.backgroundColor = '#0056b3')}
                                onMouseOut={(e) => (e.target.style.backgroundColor = '#007bff')}
                            >
                                Submit Review
                            </button>
                        </form>
                    </div>

                    {/* Recent Reviews Section */}
                    <div style={sectionStyle}>
                        <h3 style={{ color: '#555', marginBottom: '15px', fontWeight: '600' }}>
                            Recent Reviews
                        </h3>
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            <button
                                onClick={() => handleSort('newest')}
                                style={{
                                    margin: '5px',
                                    padding: '10px 20px',
                                    backgroundColor: sortOrder === 'newest' ? '#007bff' : '#e4e5e9',
                                    color: sortOrder === 'newest' ? '#fff' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                            >
                                Newest First
                            </button>
                            <button
                                onClick={() => handleSort('oldest')}
                                style={{
                                    margin: '5px',
                                    padding: '10px 20px',
                                    backgroundColor: sortOrder === 'oldest' ? '#007bff' : '#e4e5e9',
                                    color: sortOrder === 'oldest' ? '#fff' : '#333',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                            >
                                Oldest First
                            </button>
                        </div>

                        {/* Rating filter buttons */}
                        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <button
                                    key={star}
                                    onClick={() => handleRatingFilter(star)}
                                    style={{
                                        margin: '5px',
                                        padding: '10px 20px',
                                        backgroundColor: filterRating === star ? '#007bff' : '#e4e5e9',
                                        color: filterRating === star ? '#fff' : '#333',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {star} Stars
                                </button>
                            ))}
                        </div>

                        {loading ? (
                            <p style={{ textAlign: 'center', fontSize: '16px', color: '#666' }}>
                                Loading reviews...
                            </p>
                        ) : filteredReviews.length > 0 ? (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {filteredReviews.map((review) => (
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
                                                marginBottom: '5px',
                                                fontSize: '14px',
                                                color: '#666',
                                            }}
                                        >
                                            <strong>Date:</strong> {new Date(review.createdAt).toLocaleDateString()}
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
                </div>
            </div>
            <Footer />
        </>
    );
};

export default ReviewPage;