const Avatar = require('../models/avatar_model');
const asyncHandler = require('express-async-handler');
// const { validateMongoDbId } = require("../utils/validate_mongo_db_id");


const addAvatar = asyncHandler(async (req, res) => {
    const { url } = req.body;

    try {
        // Check if a avatar with the same url already exists
        const existingAvatar = await Avatar.findOne({ url: url });
        if (existingAvatar) {
            return res.json({ code: 401, status: false, message: 'Avatar with this url already exists' });
        }

        // Create a new avatar using the Avatar model
        const newAvatar = await Avatar.create(
            req.body
        );

        res.json({ code: 201, status: true, message: 'New Avatar has been added', newAvatar: newAvatar }); // Return the created quiz category as the response.
    } catch (err) {
        throw new Error(err);
    }
});


const getAllAvatars = asyncHandler(async (req, res) => {
    try {
        const allAvatars = await Avatar.find();
        if (allAvatars.length > 0) {
            res.json({
                code: 200, status: true, message: 'Fetched all avatars',
                avatars: allAvatars,
            });
        } else {
            res.json({ code: 404, status: false, message: 'No avatar found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

/*const deleteSpecificQuizCategory = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_category_id format' });
        }

        const deleteQuizCategory = await QuizCategory.findByIdAndDelete(quiz_category_id);
        if (deleteQuizCategory) {
            res.json({
                code: 200, status: true,
                message: 'Quiz Category deleted successfully'
            });
        } else {
            res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateQuizCategory = asyncHandler(async (req, res) => {
    const { quiz_category_id } = req.params;
    const { title } = req.body;

    try {

        // Check if the provided quiz_category_id is a valid ObjectId
        if (!validateMongoDbId(quiz_category_id)) {
            return res.json({ code: 400, status: false, message: 'Invalid quiz_category_id format' });
        }

        // Find the quiz category by ID
        const quizCategory = await QuizCategory.findById(quiz_category_id);
        if (!quizCategory) {
            return res.json({ code: 404, status: false, message: 'Quiz Category not found' });
        }

        // Check if the updated title already exists for another quiz
        if (title !== quizCategory.title) {
            const existingQuizCategory = await QuizCategory.findOne({ title: title });
            if (existingQuizCategory) {
                return res.json({ code: 409, status: true, message: 'Quiz Category with this title already exists' });
            }
        }

        // Update the quiz category fields
        const updatedQuizCategory = await QuizCategory.findByIdAndUpdate(
            quiz_category_id,
            {
                title: title,

            },
            {
                new: true,
            }
        );

        res.json({ code: 200, status: true, message: '', updatedQuizCategory: updatedQuizCategory });
    } catch (err) {
        throw new Error(err);
    }
});*/

module.exports = {
    addAvatar, getAllAvatars
};