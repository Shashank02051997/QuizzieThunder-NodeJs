const express = require('express');
const router = express.Router();
const { getHomeScreenDetails, getDiscoverScreenDetails, getLeaderboardDetails } = require('../controller/dashboard_controller');
const { authMiddleware } = require('../middlewares/auth_middleware');

router.get('/home', authMiddleware, getHomeScreenDetails);
router.get('/discover', authMiddleware, getDiscoverScreenDetails);
router.get('/leaderboard', authMiddleware, getLeaderboardDetails);

module.exports = router;