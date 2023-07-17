const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');

router.route('/').get(userController.getAllUsers);

exports.module = router;
