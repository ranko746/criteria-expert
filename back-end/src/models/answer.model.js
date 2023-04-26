'user strict';
var dbConn = require('../../config/db.config');

//Answer object create
var Answer = function(answer){
    this.q_id           = answer.q_id;
    this.title          = answer.title;
    this.description    = answer.description;
    this.link           = answer.link;
    this.status         = answer.status;
    // this.created_at     = new Date();
};

Answer.create = function (newAnswer, result) {    
    dbConn.query("INSERT INTO answer set ?", newAnswer, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            // result(null, res.insertId);
            Answer.findByQId(newAnswer.q_id, function(err2, res) {
                result(err2, res);
            });
        }
    });           
};

Answer.findByQId = function (q_id, result) {
    console.log("findByQId, q_id = ", q_id);
    dbConn.query("Select * from answer where q_id = ? order by title asc", q_id, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            result(null, res);
        }
    });   
};

module.exports= Answer;