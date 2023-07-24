const User = require('../models/user_model');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');

const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                req.user = await User.findById(decoded.id);
                next();
            }
        }
        catch (err) {
            return res.status(401).json({ message: 'Not Authorized token expired, Please Login again' });
        }
    } else {
        return res.status(401).json({ message: 'There is no token attached to header' });
    }
});

const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;
    const adminUser = await User.findOne({ email: email });
    if (adminUser && adminUser.role === 'admin') {
        next();
    } else {
        return res.status(401).json({ message: 'User is not an admin' });
    }
})

module.exports = { authMiddleware, isAdmin };
