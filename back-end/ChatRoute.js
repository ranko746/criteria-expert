var express = require("express");
var router = express.Router();
var chatController = require("./ChatController");
router.post("/getAnswer", (req, res) => {
    console.log("req.body",req.body);
    chatController.getAnswer(req).then(data => res.json(data)).catch(err => res.send(err))
});
module.exports = router;