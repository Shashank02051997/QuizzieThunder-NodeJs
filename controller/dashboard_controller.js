const User = require('../models/user_model');
const Quiz = require('../models/quiz_model');
const QuizCategory = require('../models/quiz_category_model');
const QuizResult = require('../models/quiz_result_model');
const asyncHandler = require('express-async-handler');
const lodash = require('lodash');
const { getStartOfWeek, getEndOfWeek } = require('../utils/app_utils');

const getHomeScreenDetails = asyncHandler(async (req, res) => {
    try {
        const allQuizzes = await Quiz.find().populate('category');
        const randomQuizzes = lodash.sampleSize(allQuizzes, 5); // Get 5 random quizzes
        const randomMostPlayedQuiz = lodash.sample(allQuizzes); // Get a random most played quiz

        res.json({
            code: 200, status: true, message: '',
            quizzes: randomQuizzes,
            most_played_quiz: randomMostPlayedQuiz
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

const getDiscoverScreenDetails = asyncHandler(async (req, res) => {
    try {
        const startOfWeek = getStartOfWeek();
        const endOfWeek = getEndOfWeek();

        const allQuizzes = await Quiz.find().populate('category');
        const allQuizCategories = await QuizCategory.find();
        const randomTopPickQuiz = lodash.sample(allQuizzes); // Get a random top pick quiz

        const quizCategoriesWithCounts = await Promise.all(
            allQuizCategories.map(async (category) => {
                const quizCount = await Quiz.countDocuments({ category: category._id });
                return {
                    _id: category._id,
                    title: category.title,
                    createdAt: category.createdAt,
                    updatedAt: category.updatedAt,
                    quizCount: quizCount,
                };
            })
        );

        const weekTopRank = await QuizResult.findOne({
            createdAt: { $gte: startOfWeek, $lt: endOfWeek }
        }).sort({ points: -1 })
            .populate('user', 'firstname lastname');

        res.json({
            code: 200, status: true, message: '',
            top_pic_quiz: randomTopPickQuiz,
            week_top_rank: weekTopRank,
            quiz_categories: quizCategoriesWithCounts
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

const getLeaderboardDetails = asyncHandler(async (req, res) => {

    try {
        const startOfWeek = getStartOfWeek();
        const endOfWeek = getEndOfWeek();

        const weeklyLeaderboard = await QuizResult.find({
            createdAt: { $gte: startOfWeek, $lt: endOfWeek }
        }).sort({ points: -1 })
            .populate('user', 'firstname lastname'); // Populate user details with specified fields
        const allTimeLeaderboard = await QuizResult.find().sort({ points: -1 })
            .populate('user', 'firstname lastname'); // Populate user details with specified fields

        if (allTimeLeaderboard.length > 0) {
            res.json({
                code: 200, status: true, message: '',
                all_time_leaderboard: allTimeLeaderboard,
                weekly_leaderboard: weeklyLeaderboard
            });
        } else {
            res.json({ code: 404, status: false, message: 'No data found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

const getProfileDetails = asyncHandler(async (req, res) => {
    let userId = req.user._id;
    try {
        const userDetail = await User.findOne(userId, 'firstname lastname about').lean();
        const stats = await QuizResult.findOne({
            user: userId
        }, '-user')
        let rank = null;
        if (stats) {
            const userPoints = stats.points;
            const higherRankUsers = await QuizResult.countDocuments({
                points: { $gt: userPoints }
            });
            rank = higherRankUsers + 1;
        }

        res.json({
            code: 200, status: true, message: '',
            user_detail: userDetail,
            // badge: {},
            stats: stats,
            rank: rank
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    getHomeScreenDetails, getDiscoverScreenDetails, getLeaderboardDetails, getProfileDetails

};