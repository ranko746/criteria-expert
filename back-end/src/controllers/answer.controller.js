'use strict';
const methods = {};

const Answer = require('../models/answer.model');


methods.create = function(req, res) {
    console.log(req.body);
    const new_answer = new Answer(req.body);

    //handles null error 
   if (req.body.constructor === Object && Object.keys(req.body).length === 0){
        res.status(400).send({ error:true, message: 'Please provide all required field' });
    } else {
        Answer.create(new_answer, function(err, answers) {
            if (err)
                res.send(err);

            res.json({error: false, message: "Answer added successfully!", data: answers});
        });
    }
};

methods.findByQId = function(req, res) {
    //handles null error 
    console.log("req.query", req.query);
    
    Answer.findByQId(req.query.q_id, function(err2, result) {
        if (err2) {
            console.log("findByQId, err = ", err2);
            res.send(err2);
        } else {
            console.log("findByQId, result = ", result);
            res.json({error: false, message: "success",data: {
                answers: result
            }});
        }
    })
};

module.exports = methods;