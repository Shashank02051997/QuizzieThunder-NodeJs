const QuizResult = require('../models/quiz_result_model');
const asyncHandler = require('express-async-handler');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const submitQuizResult = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    const { points } = req.body;

    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(userId)) {
            return res.json({ code: 400, status: false, message: 'Invalid user_id format' });
        }

        // Find the quiz result by user ID
        const quizResult = await QuizResult.findOne({ user: userId });
        if (!quizResult) {
            // Create a new quiz result using the Quiz result model
            const newQuizResult = await QuizResult.create({
                user: userId, points: points, quizPlayed: 1
            });

            return res.json({ code: 200, status: true, message: 'Quiz Result submitted successfully', newQuizResult: newQuizResult });
        }

        // Update the quiz result fields
        const updatedQuizResult = await QuizResult.findOneAndUpdate(
            { user: userId },
            {
                points: quizResult.points + parseInt(points),
                quizPlayed: quizResult.quizPlayed + 1
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

module.exports = {
    submitQuizResult
};