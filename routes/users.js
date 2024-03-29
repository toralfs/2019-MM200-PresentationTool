const express = require('express');
const route = express.Router();
const crypto = require('crypto');
const userAuth = require('../modules/auth');
 
const db = require("../modules/db")(process.env.DATABASE_URL || databaseRunLocal());
 
function databaseRunLocal() {
    const secrets = require('../secret/secrets');
    const DATABASE_URI = secrets.DATABASE_URI;
    return DATABASE_URI;
}
 
const HTTP_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    CONFLICT: 409
}
 
const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST",
    ALREADY_EXIST: "ALREADY_EXIST"
};
 
// Authenticate user
route.post('/auth', userAuth.auth);
 
 
// endpoint GET---------------------------------
route.get('/:userID', async function(req, res, next){
    let user = await db.getUser(req.params.userID);
    if(user) {
        res.status(HTTP_CODES.OK).json({user: user.name, email: user.email});
    } else {
        res.status(HTTP_CODES.NOT_FOUND).end();
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
            let user = await db.getUserByName(req.body.name);
            res.status(HTTP_CODES.CREATED).json({code: HTTP_CODES.CREATED, msg: "New user created!", userID: user.userid, userName: user.name, userEmail: user.email}); 
        } else if (insertedUser === DB_RESPONSES.ALREADY_EXIST){
            res.status(HTTP_CODES.CONFLICT).json({code: HTTP_CODES.CONFLICT, msg: "Username or email already exists!"});
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: "Invalid credentials"});
    }
});
 
 
// endpoint DELETE -----------------------------
route.delete('/:userID', async function(req, res) {
    if(req.params.userID) {
        let deletedUser = await db.deleteExistingUser(req.params.userID);
        if(deletedUser === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `User deleted.`});
        } else if(deletedUser === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "This user does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${HTTP_CODES.BAD_REQUEST} Bad Request`});
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
            let user = await db.getUserByName(req.body.name);
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `User updated`, userName: user.name, userEmail: user.email});
        } else if(updatedUser === DB_RESPONSES.ALREADY_EXIST){
            res.status(HTTP_CODES.CONFLICT).json({code: HTTP_CODES.CONFLICT, msg: "Username or email already exist"});
        } else if(updatedUser === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "This user does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Wrong credentials.`});
    }
});


module.exports = route;
