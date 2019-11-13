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

// endpoint DELETE -----------------------------
route.delete('/:slideID', async function(req, res){
    if(req.params.slideID){
        let deletedSlide = await db.deleteExistingSlide(req.params.slideID);
        if(deletedSlide === DB_RESPONSES.OK){
            res.status(HTTP_CODES.OK).json({msg: `Slide with slideID=${req.params.slideID} deleted.`});
        }
        else if(deletedSlide === DB_RESPONSES.NOT_EXIST){
            res.status(HTTP_CODES.NOT_FOUND).json({msg: "This slide does not exist"});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).end();
    }
});
// endpoint POST -----------------------------
route.post('/', async function(req, res){
    if(req.body.data && req.body.presentationID){
        let insertedSlide = await db.insertNewSlide(req.body.data, req.body.presentationID);
        if(insertedSlide === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.CREATED).json({msg: "New slide created!", code: HTTP_CODES.CREATED});   
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST).json({msg: "No wrong"});
    }
});
// endpoint GET -----------------------------
route.get('/:slideID', async function(req, res){
    let slide = await db.getSlides(req.params.slideID);
    if(slide) {
        res.status(HTTP_CODES.OK).json({data: slide});
    } else {
        res.status(HTTP_CODES.NOT_FOUND).end();
    }
});
module.exports = route;