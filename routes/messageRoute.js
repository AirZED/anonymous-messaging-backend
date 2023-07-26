const express = require('express');

const router = express.Router();
const authController = require('./../controllers/authController');
const messageController = require('./../controllers/messageController');

router.use(authController.protect);

router
  .route('/')
  .get(messageController.fetchSentMessages)
  .post(messageController.sendMessage);

router
  .route('/:id')
  .get(messageController.getMessagesFromSingleUser)
  .post(messageController.sendMessage)
  .delete(messageController.deleteMessage)
  .patch(messageController.editMessage)
  .put(messageController.reportMessage);

module.exports = router;
