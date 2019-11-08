const express = require('express');
const route = express.Router();
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
}

const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST"
};

// endpoint GET---------------------------------
route.get('/:presentationID', async function(req, res){
    let presentation = await db.getPresentation(req.params.presentationID);
    if(presentation) {
        res.status(HTTP_CODES.OK).json({name: presentation.name, owner: presentation.owner});
    } else {
        res.status(HTTP_CODES.NOT_FOUND).json({msg: "This presentation does not exist"});
    }
});

// endpoint POST--------------------------------
route.post('/', async function(req, res){
    if(req.body.name && req.body.ownerID && req.body.theme){
        let insertedPresentation = await db.insertNewPresentation(req.body.name, req.body.ownerID, req.body.theme);
        if(insertedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.CREATED).json({msg: "New presentation created!"});   
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST).json({msg: "Invalid credentials"});
    }
});

// endpoint DELETE -----------------------------
route.delete('/:presentationID', async function(req, res) {
    if(req.params.presentationID) {
        let deletedPresentation = await db.deleteExistingPresentation(req.params.presentationID);
        if(deletedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({msg: `Presentation with presentationID=${req.params.presentationID} deleted.`});
        } else if(deletedPresentation === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({msg: "This presentation does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).end();
    }
});

// endpoint PUT --------------------------------
route.put('/:presentationID', async function(req, res) {
    if(req.params.presentationID && req.body.name){
        let updatedPresentation = await db.updateExitingPresentation(req.params.presentationID, req.body.name);
        if(updatedPresentation === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({msg: `Presentation with presentationID=${req.params.presentationID} updated`});
        } else if(updatedPresentation === DB_RESPONSES.NOT_EXIST) {
            res.status(HTTP_CODES.NOT_FOUND).json({msg: "This presentation does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({msg: `Wrong credentials.`});
    }
});

module.exports = route;