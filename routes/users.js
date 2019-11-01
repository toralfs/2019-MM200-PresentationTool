const express = require('express');
const route = express.Router();
const crypto = require('crypto');

const db = require("../modules/db")(process.env.DATABASE_URL || databaseRunLocal());

function databaseRunLocal() {
    const secrets = require('../secret/secrets');
    const DATABASE_URI = secrets.DATABASE_URI;
    return DATABASE_URI;
}

const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST",
    ALREADY_EXIST: "ALREADY_EXIST"
};

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
    }
});

// endpoint POST--------------------------------
route.post('/', async function(req, res, next){
    if(req.body.password && req.body.name && req.body.email){
        let hashPssw = crypto.createHash('sha256')
            .update(req.body.password)
            .digest('hex');
        let insertedUser = await db.insertNewUser(req.body.name, req.body.email, hashPssw);
        if(insertedUser === DB_RESPONSES.OK) {
            res.status(201).json({msg: "New user created!"});   
        } else if (insertedUser === DB_RESPONSES.ALREADY_EXIST){
            res.status(409).json({msg: "Username or email already exists!"});
        }
    }
    else {
        res.status(400).json({msg: "Invalid credentials"});
    }
});


// endpoint DELETE -----------------------------
route.delete('/:userID', async function(req, res, next) {
    if(req.params.userID) {
        let deletedUser = await db.deleteExistingUser(req.params.userID);
        if(deletedUser === DB_RESPONSES.OK) {
            res.status(200).json({msg: `User with userID=${req.params.userID} deleted.`});
        } else if(deletedUser === DB_RESPONSES.NOT_EXIST){
            res.status(404).json({msg: "This user does not exist"});
        }
    } else {
        res.status(400).end();
    }
});


// endpoint PUT --------------------------------
route.put('/:userID', async function(req, res, next) {
    if(req.params.userID && req.body.name && req.body.email && req.body.password){
        let hashPssw = crypto.createHash('sha256')
            .update(req.body.password)
            .digest('hex');
        let updatedUser = await db.updateExitingUser(req.params.userID, req.body.name, req.body.email, hashPssw);
        if(updatedUser === DB_RESPONSES.OK) {
            res.status(200).json({msg: `User with userID=${req.params.userID} updated`});
        } else if(updatedUser === DB_RESPONSES.ALREADY_EXIST){
            res.status(409).json({msg: "Username or email already exist"});
        } else if(updatedUser === DB_RESPONSES.NOT_EXIST) {
            res.status(404).json({msg: "This user does not exist"});
        }
    }
    else{
        res.status(404).json({msg: `Wrong credentials.`});
    }
});


module.exports = route;