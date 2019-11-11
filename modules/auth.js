const crypto = require('crypto');
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
 
async function auth(req, res, next) {
    try  {
        if (req.body.password && req.body.name) {
            let user = await db.getUserByName(req.body.name);
            if (user) {
                if (user.password === crypto.createHash('sha256').update(req.body.password).digest('hex')) {
                    res.status(HTTP_CODES.OK).json({code: HTTP_CODES.OK, msg: `Successfully logged in!`, userID: user.userid, userName: user.name, userEmail: user.email });
                } else {
                    res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: "Wrong password" });
                }
            } else {
                res.status(HTTP_CODES.NOT_FOUND).json({code: HTTP_CODES.NOT_FOUND, msg: "Username not found" });
            }
        } else {
            res.status(HTTP_CODES.BAD_REQUEST).json({code: HTTP_CODES.BAD_REQUEST, msg: "You need to enter username and password" });
        }
    } catch(error) {
        console.log(error);
    }
    
}
 
module.exports = {
    auth: auth
}
