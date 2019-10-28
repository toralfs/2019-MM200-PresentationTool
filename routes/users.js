const express = require('express');
const route = express.Router();

const DATABASE_URI = "postgres://llzfhhyusdgmpl:26a7e2ec01f9aa91408db062a1483f56fcc1f660908813e9bfcd52fd07b09841@ec2-46-137-173-221.eu-west-1.compute.amazonaws.com:5432/d96els5b4aedqt" + "?ssl=true";
const db = require("../modules/db")(process.env.DATABASE_URL || DATABASE_URI);

// endpoint GET---------------------------------
route.get("/", (req, res, next) => {
    res.status(200).json("OK");
})

route.get('/:userID', async function(req, res, next){
    let user = await db.getUser(req.params.userID);
    // function name/ structure to change based on the db module
    res.status(200).json(user);
});

// endpoint POST--------------------------------
route.post('/newuser', async function(req, res){
    //Works, but needs error handling
    let username = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    
    await db.insertNewUser(username, email, password);
    res.status(200).json("New user created!");
});


module.exports = route;