const QuizResult = require('../models/quiz_result_model');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const submitQuizResult = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    const { points } = req.body;
    let quizWon = 0;  // Initialize the quizWon variable
    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(userId)) {
            return res.json({ code: 400, status: false, message: 'Invalid user_id format' });
        }

        // Check if points are greater than or equal to 70
        if (parseInt(points) >= 70) {
            quizWon++;  // Increment quizWon if points are greater than or equal to 70
        }

        // Find the quiz result by user ID
        const quizResult = await QuizResult.findOne({ user: userId });
        if (!quizResult) {
            // Create a new quiz result using the Quiz result model
            const newQuizResult = await QuizResult.create({
                user: userId, points: points, quizPlayed: 1, quizWon: quizWon
            });

            return res.json({ code: 200, status: true, message: 'Quiz Result submitted successfully', newQuizResult: newQuizResult });
        }

        // Update the quiz result fields
        const updatedQuizResult = await QuizResult.findOneAndUpdate(
            { user: userId },
            {
                points: quizResult.points + parseInt(points),
                quizPlayed: quizResult.quizPlayed + 1,
                quizWon: quizWon
            },
            {
                new: true,
            }
        );

        res.json({ code: 200, status: true, message: 'Quiz Result updated successfully', updatedQuizResult: updatedQuizResult });
    } catch (err) {
        throw new Error(err);
    }
});

const getAllQuizResults = asyncHandler(async (req, res) => {
    const search = req.query.search;
    try {
        //let query = {};

        if (search) {
            //query = { title: { $regex: search, $options: 'i' } }; // Case-insensitive title search
        }
        const allQuizResults = await QuizResult.find().populate('user');
        const quizResultCount = await QuizResult.countDocuments();
        if (allQuizResults.length > 0) {
            res.json({
                code: 200, status: true, message: '',
                count: quizResultCount,
                quiz_results: allQuizResults,
            });
        } else {
            res.json({ code: 404, status: false, message: 'No quiz result found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

const getSpecificQuizResult = asyncHandler(async (req, res) => {
    const { quiz_result_id } = req.params;

    try {

        // Check if the provided quiz_result_id is a valid ObjectId
        if (!validateMongoDbId(quiz_result_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz result id format' });
        }

        const quizResult = await QuizResult.findById(quiz_result_id).populate('user');
        if (quizResult) {
            res.json({ code: 200, status: true, message: '', quizResult: quizResult });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz Result not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});


module.exports = {
    submitQuizResult, getAllQuizResults, getSpecificQuizResult
};