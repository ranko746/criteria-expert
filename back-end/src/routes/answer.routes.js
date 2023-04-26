const express = require('express')
const router = express.Router()
const answerController = require('../controllers/answer.controller');

// Create a new answer
router.post('/', answerController.create);
router.get('/findByQId', answerController.findByQId);


module.exports = router