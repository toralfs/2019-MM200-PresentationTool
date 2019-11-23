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
};

const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST",
    ALREADY_EXIST: "ALREADY_EXIST"
};

async function share(req, res) {
    try  {
        if (req.body.public && req.params.presentationID) {
            let updateShare = await db.sharePresentation(req.params.presentationID, req.body.public);
            if(updateShare == DB_RESPONSES.OK){
                let status = "";
                if(req.body.public == "true"){
                    status = "public";
                }
                else if(req.body.public == "false"){
                    status = "private";
                }
                res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation is ${status}`});
            }
            else{
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `Presentation not found`});
            }
        }
        else{
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: `Error ${HTTP_CODES.BAD_REQUEST} Bad Request`});
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
                    res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation shared with ${user.name}`});
                }
                else if(shared == DB_RESPONSES.ALREADY_EXIST){
                    res.status(HTTP_CODES.CONFLICT).json({code: HTTP_CODES.CONFLICT, msg: `Presentation already shared with ${user.name}`});
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
                    res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Presentation unshared with ${user.name}`});
                }
                else if(unshared == DB_RESPONSES.ALREADY_EXIST){
                    res.status(HTTP_CODES.CONFLICT).json({code: HTTP_CODES.CONFLICT, msg: `Presentation not shared with ${user.name}. Cannot unshare.`});
                }
                else{
                    res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `Presentation not found`});
                }
            }
            else{
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `User not found`});
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

async function sharedWithMe(req,res){
    try{
        let sharedPres = await db.getSharedWithMe(req.params.userID);
        if(sharedPres && sharedPres.length > 0){
            res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, presentations: sharedPres});
        }
        else{
            res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `You don't have any shared presentations.`});
        }
    }
    catch(error){
        console.log(error);
    }
}

async function getPublicPresentations(req,res){
    let publicPres = await db.publicPresentations();
    if(publicPres && publicPres.length > 0){
        res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, presentations: publicPres});
    }
    else{
        res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: `No public presentations available.`});
    }
}

module.exports = {
    share: share,
    shareWithUser: shareWithUser,
    unshareWithUser: unshareWithUser,
    sharedWithMe: sharedWithMe,
    publicPresentations: getPublicPresentations
}

