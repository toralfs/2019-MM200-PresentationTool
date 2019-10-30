const express = require('express');
const route = express.Router();

//DATABASE_URI from Heroku is not static, needs to be updated once in a while
const DATABASE_URI = "postgres://llzfhhyusdgmpl:26a7e2ec01f9aa91408db062a1483f56fcc1f660908813e9bfcd52fd07b09841@ec2-46-137-173-221.eu-west-1.compute.amazonaws.com:5432/d96els5b4aedqt" + "?ssl=true";
const db = require("../modules/db")(process.env.DATABASE_URL || DATABASE_URI);

// endpoint GET---------------------------------
route.get('/:userID', async function(req, res, next){
    let user = await db.getUser(req.params.userID);
    if(user) {
        res.status(200).json(user);
    } else {
        res.status(404).end();
        //more complex error handling to come
    }
    
});

// endpoint POST--------------------------------
route.post('/', async function(req, res){
    await db.insertNewUser(req.body.name, req.body.email, req.body.password);
    res.status(200).json("New user created!");
});


// endpoint DELETE -----------------------------
route.delete('/:userID', async function(req, res) {
    await db.deleteExistingUser(req.params.userID);
    res.status(200).json(`User with userID=${req.params.userID} deleted.`);
});


// endpoint PUT --------------------------------
route.put('/:userID', async function(req, res) {
    await db.updateExitingUser(req.params.userID, req.body.name, req.body.email, req.body.password);
    res.status(200).json(`User with userID=${req.params.userID} updated`);
});


module.exports = route;