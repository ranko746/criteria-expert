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

module.exports = methods;