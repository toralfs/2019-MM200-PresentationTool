const express = require('express');
const route = express.Router();
const db = require("../modules/db")(process.env.dbconnection);

// endpoint GET---------------------------------
route.get("/", (req, res, next) => {
    res.status(200).json("OK");
})

route.get('/:userID', function(req, res, next){
    let user = req.params.userID;
    let test = db.getUser(user);

    //let user = db.getUser(req.body.userID);
    // function name/ structure to change based on the db module
    
    res.status(200).json(test);

});

// endpoint POST--------------------------------
/*
route.post('/', function(req,res){

    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;
    //to be tested after creating the user

});
*/

module.exports = route;