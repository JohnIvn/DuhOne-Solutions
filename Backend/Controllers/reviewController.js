import { Review } from '../Models/reviewModel.js';  
import { UserAccount } from '../Models/signUpModel.js'; 

export const createReview = async (req, res) => {
    const { content, rating } = req.body;
    console.log('User:', req.user); 

    if (!content || !rating) {
        return res.status(400).json({ message: 'Review content and rating are required.' });
    }

    try {
        const newReview = await Review.create({
            createdBy: req.user.userId, 
            reviewContent: content,
            rating,
        });

        return res.status(201).json({
            message: 'Review submitted successfully!',
            review: newReview,
        });
    } catch (err) {
        console.error('Error saving review:', err);
        return res.status(500).json({ message: 'An error occurred while saving the review.' });
    }
};

export const getReviews = async (req, res) => {
    try {
        const reviews = await Review.findAll({
            include: {
                model: UserAccount,
                attributes: ['userId'],  
            },
        });
        
        return res.status(200).json({ reviews });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        return res.status(500).json({ message: 'An error occurred while fetching reviews.' });
    }
};