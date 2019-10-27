const express = require('express');
const route = express.Router();

// endpoint GET---------------------------------
route.get("/", (req, res, next) => {
    res.status(200).json("OK");
})

route.get('/:userID', function(req, res){
    
    let test = db.getUser([req.params.uesrID]);

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

module.export = route;