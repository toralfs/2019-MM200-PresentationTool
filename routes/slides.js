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
    NOT_FOUND: 404,
    CONFLICT: 409
}
 
const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST"
};

// endpoint DELETE -----------------------------
route.delete('/:slideID', async function(req, res){
    if(req.params.slideID){
        let deletedSlide = await db.deleteExistingSlide(req.params.slideID, req.body.presentationID);
        if(deletedSlide === DB_RESPONSES.OK){
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK,msg: `Slide with slideID=${req.params.slideID} deleted.`});
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
        if(insertedSlide.dbRes === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.CREATED).json({msg: "New slide created!", code: HTTP_CODES.CREATED, slideid: insertedSlide.slideid});   
        }
    }
    else {
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Bad request`});
    }
});
// endpoint GET -----------------------------
route.get('/:presentationID', async function(req, res){
    let slide = await db.getSlides(req.params.presentationID);
    if(slide && slide.length>0) {
        res.status(HTTP_CODES.OK).json({data: slide, code: HTTP_CODES.OK});
    } else {
        res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `This presentation does not have any slides`});
    }
});
// endpoint PUT -----------------------------
route.put('/:slideID', async function(req, res) {
    if(req.params.slideID && req.body.data){
        let updatedSlide = await db.updateExitingSlide(req.params.slideID, req.body.data);
        if(updatedSlide === DB_RESPONSES.OK) {
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Slide with slideID=${req.params.slideID} updated`, data: updatedSlide});
        }else{
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Bad request`});
        }
    }
    else{
        res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Wrong credentials.`});
    }
});
module.exports = route;