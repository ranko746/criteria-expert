'user strict';
var dbConn = require('../../config/db.config');

//Question object create
var Question = function(question){
    this.title     = question.title;
    // this.created_at     = new Date();
};

Question.findByTitle = function (title, result) {
    dbConn.query("Select * from question where title = ? ", title, function (err, res) {             
        if(err) {
            console.log("error: ", err);
            result(err, null);
        } else {
            if (res.length > 0) {
                console.log("exist id: ", res[0].id);
                result(null, res[0].id);
            } else {
                const newQue = new Question({"title": title});

                Question.create(newQue, function(err2, insertId) {
                    if(err2) {
                        console.log("error: ", err2);
                        result(err2, null);
                    } else {
                        console.log("insertId", insertId);
                        result(null, insertId);
                    }
                });
            }
        }
    });   
};

Question.create = function (newQue, result) {    
    dbConn.query("INSERT INTO question set ?", newQue, function (err, res) {
        if(err) {
            console.log("error: ", err);
            result(err, null);
        }
        else{
            console.log(res.insertId);
            result(null, res.insertId);
        }
    });           
};

module.exports= Question;