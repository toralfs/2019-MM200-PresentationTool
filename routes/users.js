const express = require('express');
const route = express.Router();
const crypto = require('crypto');
const dbSecret = require('../secret/secrets');


//DATABASE_URI from Heroku is not static, needs to be updated once in a while
const DATABASE_URI = dbSecret.DATABASE_URI;
const db = require("../modules/db")(process.env.DATABASE_URL || DATABASE_URI);


// Authenticate user
route.post('/auth', async function (req, res, next) {
    if(req.body.password && req.body.name){
        let user = await db.getUserByName(req.body.name);
        if(user) {
            if(user.password === crypto.createHash('sha256').update(req.body.password).digest('hex')){
                res.status(200).json({msg: `Successfully logged in!`, userID: user.userid, userName: user.name, userEmail: user.email});
            } else {
                res.status(400).json({msg: "Wrong password"});
            }
        } else {
            res.status(404).json({msg: "Username not found"});
        }
        
    } else {
        res.status(400).json({msg: "You need to enter username and password"});
    }
});


// endpoint GET---------------------------------
route.get('/:userID', async function(req, res, next){
    let user = await db.getUser(req.params.userID);
    if(user) {
        res.status(200).json({user: user.name, email: user.email});
    } else {
        res.status(404).end();
        //more complex error handling to come
    }
    
});

// endpoint POST--------------------------------
route.post('/', async function(req, res, next){
    if(req.body.password && req.body.name && req.body.email){

        let hashPssw = crypto.createHash('sha256')
            .update(req.body.password)
            .digest('hex');
        await db.insertNewUser(req.body.name, req.body.email, hashPssw);
        res.status(201).json("New user created!");
        
    }
    else{
        res.status(404).json("Invalid credentials");
    }
    
    
});


// endpoint DELETE -----------------------------
route.delete('/:userID', async function(req, res, next) {
    await db.deleteExistingUser(req.params.userID);
    res.status(200).json(`User with userID=${req.params.userID} deleted.`);
});


// endpoint PUT --------------------------------
route.put('/:userID', async function(req, res, next) {

    if(req.params.userID && req.body.name && req.body.email && req.body.password){
        let hashPssw = crypto.createHash('sha256')
            .update(req.body.password)
            .digest('hex');
        await db.updateExitingUser(req.params.userID, req.body.name, req.body.email, hashPssw);
        res.status(200).json(`User with userID=${req.params.userID} updated`);
    }
    else{
        res.status(404).json(`User not found. Wrong credentials.`);
    }
    
});


module.exports = route;