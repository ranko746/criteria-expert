const express = require('express')
const router = express.Router()

const questionController = require('../controllers/question.controller');

// Retrieve a question and answers with title
router.post('/findByTitle', questionController.findByTitle);

module.exports = router