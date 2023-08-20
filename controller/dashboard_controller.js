const User = require('../models/user_model');
const Quiz = require('../models/quiz_model');
const QuizCategory = require('../models/quiz_category_model');
const QuizResult = require('../models/quiz_result_model');
const asyncHandler = require('express-async-handler');
const lodash = require('lodash');

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

        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

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
            updatedAt: { $gte: oneWeekAgo, $lt: currentDate }
        }).sort({ points: -1 })
            .populate('user', 'firstname lastname profilePic');

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
        const currentDate = new Date();
        const oneWeekAgo = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyLeaderboard = await QuizResult.find({
            updatedAt: { $gte: oneWeekAgo, $lt: currentDate }
        }).sort({ points: -1 })
            .populate('user', 'firstname lastname profilePic'); // Populate user details with specified fields
        const allTimeLeaderboard = await QuizResult.find().sort({ points: -1 })
            .populate('user', 'firstname lastname profilePic'); // Populate user details with specified fields

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
        const userDetail = await User.findOne(userId, '-password').lean();
        const stats = await QuizResult.findOne({
            user: userId
        }, '-user')
        let rank = null;
        let successRate = 0;
        let averagePointsPerQuiz = 0;
        const totalQuizzesAvailable = await Quiz.countDocuments();
        let quizParticipationRate = 0;
        let statsResult = null;

        if (stats) {
            successRate = (stats.quizWon / stats.quizPlayed) * 100;
            averagePointsPerQuiz = stats.points / stats.quizPlayed;
            quizParticipationRate = (stats.quizPlayed / totalQuizzesAvailable) * 100;

            const userPoints = stats.points;
            const higherRankUsers = await QuizResult.countDocuments({
                points: { $gt: userPoints }
            });
            rank = higherRankUsers + 1;

            statsResult = {
                quiz_won: stats.quizWon,
                _id: stats._id,
                points: stats.points,
                total_quiz_played: stats.quizPlayed,
                rank: rank,
                success_rate: successRate,
                average_points_per_quiz: averagePointsPerQuiz,
                quiz_participation_rate: quizParticipationRate,
                createdAt: stats.createdAt,
                updatedAt: stats.updatedAt
            };
        }

        res.json({
            code: 200, status: true, message: 'Profile details fetched successfully',
            user_detail: userDetail,
            // badge: {},
            stats: statsResult,
        });
    }
    catch (err) {
        throw new Error(err);
    }
});

module.exports = {
    getHomeScreenDetails, getDiscoverScreenDetails, getLeaderboardDetails, getProfileDetails

};