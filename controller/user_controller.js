const User = require('../models/user_model');
const asyncHandler = require('express-async-handler');
const generateToken = require('../config/jwt_token');
const { validateMongoDbId } = require("../utils/validate_mongo_db_id");
const bcrypt = require('bcrypt');

const createUser = asyncHandler(
    async (req, res) => {
        try {
            const email = req.body.email;
            const findUser = await User.findOne({ email: email });
            if (!findUser) {
                const newUser = await User.create(req.body);

                const result = {
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email,
                    mobile: newUser.mobile,
                    _id: newUser._id,
                    createdAt: newUser.createdAt,
                    updatedAt: newUser.updatedAt,
                };

                res.json({ code: 200, status: true, message: 'User created successfully', result: result });
            }
            else {
                res.status(401).json({ message: 'User already exists' });
                //throw new Error('User already exists');
            }
        }
        catch (err) {
            throw new Error(err);
        }
    }
);

const loginUser = asyncHandler(async (req, res) => {
    try {
        const { mobile, password } = req.body;
        // Validate mobile number format (you may need to adjust this based on your mobile number format).
        const mobileRegex = /^\d{10}$/;
        if (!mobile.match(mobileRegex)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        const user = await User.findOne({ mobile: mobile });
        if (user) {
            if (user.isBlocked) {
                return res.status(403).json({ message: "You can't login because you are blocked by the admin" });
            }

            if (await user.isPasswordMatched(password)) {
                const result = {
                    _id: user._id,
                    firstname: user.firstname,
                    lastname: user.lastname,
                    email: user.email,
                    mobile: user.mobile,
                    token: generateToken(user._id),
                };

                res.json({
                    code: 200, status: true, message: 'Login successfully', result: result

                });
            } else {
                res.status(401).json({ message: 'Invalid Credentials' });
            }
        } else {
            res.status(401).json({ message: 'Invalid Credentials' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const adminLogin = asyncHandler(async (req, res) => {
    try {
        const { mobile, password } = req.body;
        // Validate mobile number format (you may need to adjust this based on your mobile number format).
        const mobileRegex = /^\d{10}$/;
        if (!mobile.match(mobileRegex)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        const user = await User.findOne({ mobile: mobile });
        if (user) {
            if (user.role === 'admin') {

                if (await user.isPasswordMatched(password)) {
                    res.json({
                        _id: user._id,
                        firstname: user.firstname,
                        lastname: user.lastname,
                        email: user.email,
                        mobile: user.mobile,
                        token: generateToken(user._id),
                    });
                } else {
                    res.status(401).json({ message: 'Invalid Credentials' });
                }
            } else {
                res.status(401).json({ message: 'Login as Amdin' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }

    } catch (err) {
        throw new Error(err);
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const allUsers = await User.find();
        const userCount = await User.countDocuments();
        if (allUsers.length > 0) {
            res.json({
                count: userCount,
                users: allUsers,
            });
        } else {
            res.status(404).json({ message: 'No users found' });
        }
    }
    catch (err) {
        throw new Error(err);
    }
});

const getSpecificUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(user_id)) {
            return res.status(400).json({ message: 'Invalid user_id format' });
        }

        const user = await User.findById(user_id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const deleteSpecificUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(user_id)) {
            return res.status(400).json({ message: 'Invalid user_id format' });
        }

        const deleteUser = await User.findByIdAndDelete(user_id);
        if (deleteUser) {
            res.json({
                message: 'User deleted successfully'
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateUser = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { _id, role } = req.user;
    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(user_id)) {
            return res.status(400).json({ message: 'Invalid user_id format' });
        }

        // If the requester is not an admin and is trying to update another user's details, return a 403 Forbidden response.
        if (role !== 'admin' && user_id !== _id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to update this user' });
        }
        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
            },
            {
                new: true,
            }
        );
        if (updateUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const updateUserBlockStatus = asyncHandler(async (req, res) => {
    const { user_id } = req.params;
    const { isBlocked } = req.body;

    try {

        // Check if the provided user_id is a valid ObjectId
        if (!validateMongoDbId(user_id)) {
            return res.status(400).json({ message: 'Invalid user_id format' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            user_id,
            {
                isBlocked: isBlocked,
            },
            {
                new: true,
            }
        );

        if (updatedUser) {
            const message = isBlocked ? 'User blocked successfully' : 'User unblocked successfully';
            res.json({ message });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});


const logout = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    try {

        const user = await User.findById(_id);
        if (user) {
            res.json({
                message: 'User logged out successfully'
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const forgotPassword = asyncHandler(async (req, res) => {
    try {
        const { mobile } = req.body;
        // Validate mobile number format (you may need to adjust this based on your mobile number format).
        const mobileRegex = /^\d{10}$/;
        if (!mobile.match(mobileRegex)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        const user = await User.findOne({ mobile: mobile });
        if (user) {
            res.json(user);
        }
        else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (err) {
        throw new Error(err);
    }
});

const resetPassword = asyncHandler(async (req, res, next) => {
    try {
        const { mobile, new_password } = req.body;

        // Validate mobile number format (you may need to adjust this based on your mobile number format).
        const mobileRegex = /^\d{10}$/;
        if (!mobile.match(mobileRegex)) {
            return res.status(400).json({ message: 'Invalid mobile number format' });
        }

        // Find the user by mobile number.
        const user = await User.findOne({ mobile: mobile });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password before updating.
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(new_password, salt);

        // Update the user's password.
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            {
                password: hashedPassword,
            },
            {
                new: true,
            }
        );

        if (updatedUser) {
            res.json({ message: 'Password updated successfully' });
        } else {
            res.status(500).json({ message: 'Failed to update password' });
        }
    } catch (err) {
        next(err); // Pass the error to the global error handler.
    }
});

module.exports = {
    createUser, loginUser, adminLogin, getAllUsers, getSpecificUser, deleteSpecificUser,
    updateUser, updateUserBlockStatus, logout, forgotPassword, resetPassword
};