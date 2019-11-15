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

async function share(req, res) {
    try  {
        if (req.body.public && req.params.presentationID) {
            let updateShare = await db.sharePresentation(req.params.presentationID, req.body.public);
            if(updateShare == DB_RESPONSES.OK){
                let status = "";
                if(req.body.public == "true"){
                    status = "publicly shared";
                }
                else if(req.body.public == "false"){
                    status = "unshared";
                }
                res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation with ID=${req.params.presentationID} ${status}`});
            }
            else{
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `Presentation not found`});
            }
        }
        else{
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${code} Bad Request`});
        }
    } catch(error) {
        console.log(error);
    }
    
}

async function shareWithUser(req,res){
    try{
        if(req.body.username && req.params.presentationID){
            let user = await db.getUserByName(req.body.username);
            let presentation = await db.getPresentationByID(req.params.presentationID);
            if(user && user.userid != presentation.ownerid){
                let shared = await db.sharePresentationWithUser(req.params.presentationID, user.userid);
                if(shared == DB_RESPONSES.OK){
                    res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation with ID=${req.params.presentationID} shared with ${user.name}`});
                }
                else{
                    res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `Presentation not found`});
                }
            }
            else{
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `User '${req.body.username}' not found`});
            }
        }
        else{
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Invalid request`});
        }
    }
    catch(error){
        console.log(error);
    }
}

async function unshareWithUser(req,res){
    try{
        if(req.body.username && req.params.presentationID){
            let user = await db.getUserByName(req.body.username);
            let presentation = await db.getPresentationByID(req.params.presentationID);
            if(user && user.userid != presentation.ownerid){
                let unshared = await db.unsharePresentationWithUser(req.params.presentationID, user.userid);
                if(unshared == DB_RESPONSES.OK){
                    res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation with ID=${req.params.presentationID} unshared with ${user.name}`});
                }
                else{
                    res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `Presentation not found`});
                }
            }
            else{
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `User '${req.body.username}' not found`});
            }
        }
        else{
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Invalid request`});
        }
    }
    catch(error){
        console.log(error);
    }
}

module.exports = {
    share: share,
    shareWithUser: shareWithUser,
    unshareWithUser: unshareWithUser
}

