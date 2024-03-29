const express = require('express');
const route = express.Router();
const sharing = require("../modules/sharing");
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
    NOT_FOUND: 404
};

const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST"
};

// GET presentations by ownerID-----------------
route.get('/:userID', async function(req, res){
    let presentations = await db.getPresentationsByUser(req.params.userID);
    let user = await db.getUser(req.params.userID);
    if(user){
        if(presentations && presentations.length > 0) {
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, presentations: presentations});
        } else {
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "You don't have any presentations"});
        }
    }
    else{
        res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "This user does not exist"});
    }
    
});

// endpoint POST--------------------------------
route.post('/', async function(req, res){
    if(req.body.name && req.body.ownerID && req.body.theme){
        let insertedPresentation = await db.insertNewPresentation(req.body.name, req.body.ownerID, req.body.theme);
        if(insertedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.CREATED).json({code: HTTP_CODES.CREATED, msg: "New presentation created!"});   
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${HTTP_CODES.BAD_REQUEST} Bad Request`});
    }
});

// endpoint DELETE -----------------------------
route.delete('/:presentationID', async function(req, res) {
    if(req.params.presentationID) {
        let deletedPresentation = await db.deleteExistingPresentation(req.params.presentationID);
        if(deletedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation deleted.`});
        } else if(deletedPresentation === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "This presentation does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${HTTP_CODES.BAD_REQUEST} Bad Request`});
    }
});

// endpoint PUT --------------------------------
route.put('/:presentationID', async function(req, res) {
    if(req.params.presentationID && req.body.name && req.body.theme){
        let updatedPresentation = await db.updateExitingPresentation(req.body.name, req.body.theme, req.params.presentationID);
        if(updatedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Changes saved`});
        } else if(updatedPresentation === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "This presentation does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${HTTP_CODES.BAD_REQUEST} Bad Request`});
    }
});

//Presentation sharing--------------------

//Make presentation public/private
route.put('/:presentationID/public', sharing.share);

//Share with specific user
route.put('/:presentationID/share', sharing.shareWithUser);

//Unshare with specific user
route.put('/:presentationID/unshare', sharing.unshareWithUser);

//Get presentations shared with user that has userID
route.get('/:userID/shared-with-me', sharing.sharedWithMe);

//Get public presentations
route.get('/:userID/public', sharing.publicPresentations);

module.exports = route;