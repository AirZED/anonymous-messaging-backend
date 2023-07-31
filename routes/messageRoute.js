const express = require('express');

const router = express.Router();
const authController = require('./../controllers/authController');
const messageController = require('./../controllers/messageController');

// THIS ROUTES CAN ONLY BE ACCESSED BY LOGGED IN USERS
router.use(authController.protect);

router
  .route('/')
  // GET ALL MESSAGES
  .get(messageController.fetchSentMessages)
  .post(messageController.searchMessage);

// ADMIN ACTIVITIES.....................................................

router.post(
  '/reportedMessages/:messageId',
  authController.restrictTo('admin'),
  // HANDLE REPORTED MESSAGES
  messageController.handleReportedMessage,
);

router.get(
  '/reportedMessages',
  authController.restrictTo('admin'),
  // GET REPORTED MESSAGES
  messageController.getReportedMessages,
);
// .......................................................................

// NORMAL USER ACTIVITIES.................................................
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
router.patch('/:messageId/report', messageController.reportMessage);
// ..........................................................................

module.exports = router;
