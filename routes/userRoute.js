const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.patch('/forgetPassword', authController.forgotPassword);
router.patch('/resetPassword/:resetToken', authController.resetPassword);

router.patch(
  '/updateMe',
  authController.protect,
  userController.updateUserDetails,
);
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('admin'),
    userController.getAllUsers,
  );

module.exports = router;
