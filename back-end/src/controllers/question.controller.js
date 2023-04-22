'use strict';
const methods = {};

const Question = require('../models/question.model');
const Answer = require('../models/answer.model');

methods.findByTitle = function(req, res) {
    //handles null error 
    console.log("req.body", req.body);
    if(req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    } else {
        Question.findByTitle(req.body.title, function(err, q_id) {
            console.log("findByTitle, q_id = ", q_id);
            if (err)
                res.send(err);
            
            Answer.findByQId(q_id, function(err2, result) {
                if (err2) {
                    console.log("findByQId, err = ", err2);
                    res.send(err);
                } else {
                    console.log("findByQId, result = ", result);
                    res.json({error: false, message: "success",data: {
                        q_id: q_id,
                        answers: result
                    }});
                }
            })
        });
    }
};

module.exports = methods;