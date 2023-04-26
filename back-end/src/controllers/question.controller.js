'use strict';
const methods = {};

const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

methods.getSimilarQuestions = function(req, res) {
    //handles null error 
    console.log("req.body", req.body);
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    } else {
        Question.findByTitle(req.body.title, function(err, q_id) {

            if (err)
                res.send(err);
            
            Question.getSimilarQuestions(req.body.title, function(err, items) {
                if (err)
                    res.send(err);
    
                console.log("items => ", items);
                
                res.json({error: false, message: "success",data: {
                    q_id, q_id,
                    questions: items
                }});
            });
        });
    }
};

module.exports = methods;