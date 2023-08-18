const express = require('express');
const router = express.Router();
const { createUser, loginUser, adminLogin, getAllUsers, getSpecificUser,
    deleteSpecificUser, updateUser, updateUserBlockStatus, logout,
    forgotPassword, createNewPassword, resetPassword, verifyMobileOtp } = require('../controller/user_controller');
const { authMiddleware, isAdmin } = require('../middlewares/auth_middleware');

router.post('/register', createUser);
router.post('/verify/mobile-otp', verifyMobileOtp);
//router.post('/verify/email-otp', verifyEmailOtp);
router.post('/login', loginUser);
router.post('/admin-login', adminLogin);
router.get('/all-users', authMiddleware, isAdmin, getAllUsers);
router.get('/:user_id', authMiddleware, getSpecificUser);
router.delete('/:user_id', authMiddleware, isAdmin, deleteSpecificUser);
router.put('/update/:user_id', authMiddleware, updateUser);
router.put('/:user_id/block-status', authMiddleware, isAdmin, updateUserBlockStatus);
router.get('/logout', authMiddleware, logout);
router.post('/forgot-password', forgotPassword);
router.put('/create-new-password', createNewPassword);
router.put('/reset-password', authMiddleware, resetPassword);

module.exports = router;