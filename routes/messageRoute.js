const express = require('express');

const router = express.Router();
const authController = require('./../controllers/authController');
const messageController = require('./../controllers/messageController');

// THIS ROUTES CAN ONLY BE ACCESSED BY LOGGED IN USERS
router.use(authController.protect);

router
  .route('/')
  // GET ALL MESSAGES
  .get(messageController.fetchSentMessages);

router
  .route('/:id')
  // GET MESSAGES SENT TO SINGLE USER
  .get(messageController.getMessagesSentToSingleUser)
  // SEND MESSAGE
  .post(messageController.sendMessage)
  // DELETE MESSAGE
  .delete(messageController.deleteMessage)
  // EDIT SENT MESSAGE
  .patch(messageController.editMessage);

// GET MESSAGES SENT FROM A SINGLE ANONYMOUUS USER
router.route('/anonymous/:id').get(messageController.getMessagesFromSingleUser);

// REPORT MESSAGE
router.route('/:messageId/report').patch(messageController.reportMessage);

// RESTRICTED ROUTES TO ONLY ADMIN
router.use(authController.restrictTo('admin'));

router.get('/reportedMessages/p', messageController.getReportedMessages);
router
  .route('/reportedMessages/:messageId')
  .post(messageController.handleReportedMessage);

module.exports = router;
