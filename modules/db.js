const pg = require('pg');

const DB_RESPONSES = {
    OK: "OK",
    NOT_EXIST: "NOT_EXIST",
    ALREADY_EXIST: "ALREADY_EXIST"
};

const db = function (dbConnectionString) {
    const connectionString = dbConnectionString;

    async function runQuery(query, params) {
        const client = new pg.Client(connectionString);
        await client.connect();
        const res = await client.query(query, params);
        let response = res.rows[0];
        await client.end();
        return response;
    }

    async function runQueryAll(query, params) {
        const client = new pg.Client(connectionString);
        await client.connect();
        const res = await client.query(query, params);
        let response = res.rows;
        await client.end();
        return response;
    }

    // ------------------------ Users --------------------------------
    
    const getUserByName = async function (userName) {
        let userData = null;
        try {
            userData = await runQuery('SELECT * FROM users WHERE name=$1', [userName]);
        } catch (error) {
            console.error(error);
        }
        return userData;
    }

    const getUserByEmail = async function (userName) {
        let userData = null;
        try {
            userData = await runQuery('SELECT * FROM users WHERE email=$1', [userName]);
        } catch (error) {
            console.error(error);
        }
        return userData;
    }

    const getUserByID = async function (userID) {
        let userData = null;
        try {
            userData = await runQuery(`SELECT * FROM users WHERE userID=$1`, [userID]);
        } catch (error) {
            console.error(error);
        }
        return userData;
    }

    const insertUser = async function (userName, userEmail, userPassword) {
        let response = null;
        if (await getUserByName(userName) || await getUserByEmail(userEmail)) {
            response = DB_RESPONSES.ALREADY_EXIST;
        } else {
            try {
                await runQuery(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`, [userName, userEmail, userPassword]);
                response = DB_RESPONSES.OK;
            } catch (error) {
                console.error(error);
            }
        }
        return response;
    }

    const deleteUser = async function (userID) {
        let response = null;
        if (await getUserByID(userID)) {
            try {
                await runQuery(`DELETE FROM users WHERE userID=$1`, [userID]);
                response = DB_RESPONSES.OK;
            } catch (error) {
                console.error(error);
            }
        } else {
            response = DB_RESPONSES.NOT_EXIST;
        }
        return response;
    }


    const updateUser = async function (userID, userName, userEmail, userPassword) {
        let response = null;
        let userToUpdate = await getUserByID(userID);
        if (userToUpdate) {
            let usernameCheck = await getUserByName(userName);
            let useremailCheck = await getUserByEmail(userEmail);

            if (usernameCheck && usernameCheck.name !== userToUpdate.name) {
                response = DB_RESPONSES.ALREADY_EXIST;
            } else if (useremailCheck && useremailCheck.email !== userToUpdate.email) {
                response = DB_RESPONSES.ALREADY_EXIST;
            } else {
                try {
                    await runQuery(`UPDATE users SET name=$2, email=$3, password=$4 WHERE userID=$1`, [userID, userName, userEmail, userPassword]);
                    response = DB_RESPONSES.OK;
                } catch (error) {
                    console.error(error);
                }
            }
        } else {
            response = DB_RESPONSES.NOT_EXIST;
        }
        return response;
    }


    // ----------------------- Presentations ---------------------------------
    const getPresentationsByUserID = async function (ownerID) {
        let presentationData = null;
        try {
            presentationData = await runQueryAll(`SELECT * FROM presentations WHERE ownerID=$1`, [ownerID]);
        } catch (error) {
            console.error(error);
        }
        return presentationData;
    }

    const insertPresentation = async function (presentationName, ownerID, theme) {
        let response = null;
        try {
            await runQuery(`INSERT INTO presentations(name, slides, ownerID, sharedUsers, public, theme) VALUES ($1, '{}', $2, '{}', false, $3)`, [presentationName, ownerID, theme]);
            response = DB_RESPONSES.OK;
        } catch (error) {
            console.error(error);
        }

        return response;
    }

    const deletePresentation = async function (presentationID) {
        let response = null;
        try {
            let presentationToDelete = await runQuery(`SELECT slides FROM presentations WHERE presentationID=$1`, [presentationID]);
            for(let slide of presentationToDelete.slides) {
                await runQuery(`DELETE FROM slides WHERE slideID=$1`, [slide]);
            }
            await runQuery(`DELETE FROM presentations WHERE presentationID=$1`, [presentationID]);
            response = DB_RESPONSES.OK;
        } catch (error) {
            console.error(error);
        }

        return response;
    }

    const udpatePresentation = async function (presentationName, theme, presentationID) {
        let response = null;
        try {
            await runQuery(`UPDATE presentations SET name=$1, theme=$2, last_updated=current_timestamp WHERE presentationID=$3`, [presentationName, theme, presentationID]);
            response = DB_RESPONSES.OK;
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    const getPublicPresentations = async function(){
        let presentationData = null;
        try {
            presentationData = await runQueryAll(`SELECT * FROM presentations WHERE public=true`);
        } catch (error) {
            console.error(error);
        }
        return presentationData;
    }

    const sharePresentation = async function(presentationID, public){
        let response = null;
        if(presentationID){
            try{
                await runQuery(`UPDATE presentations SET public=$2 WHERE presentationID=$1`, [presentationID, public]);
                response = DB_RESPONSES.OK;
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            response = DB_RESPONSES.NOT_EXIST;
        }
        return response;
    }

    // -------------------- Slides --------------------
    const getSlidesByPresID = async function (presentationID) {
        let slideData = null;
        try {
            slideData = await runQueryAll(`SELECT * FROM slides WHERE presentationID=$1`, [presentationID]);
        } catch (error) {
            console.error(error);
        }
        return slideData;
    }
    
    const insertSlide = async function (data, presentationID) {
        let response = null;
        try {
            let insertedSlide = await runQuery(`INSERT INTO slides (data, presentationID) VALUES ($1, $2) RETURNING slideID`, [data, presentationID]);
            let slideID = insertedSlide.slideid;
            await runQuery(`UPDATE presentations SET last_updated=current_timestamp, slides = slides || $1::int WHERE presentationID = $2`, [slideID, presentationID]);
            response = DB_RESPONSES.OK; 
        } catch (error) {
            console.error(error);
        }
        return response;
    }

    const deleteSlide = async function (slideID, presentationID) {
        let response = null;
        try {
            await runQuery(`DELETE FROM slides WHERE slideID=$1`, [slideID]);
            await runQuery(`UPDATE  presentations SET slides = array_remove(slides, $1) WHERE presentationID = $2;`, [slideID, presentationID]);
            response = DB_RESPONSES.OK;
        } catch (error) {
            console.log(error);
        }
        return response;
    }
    
    const updateSlide = async function (slideID, data){
        let response = null;
        try{
            await runQuery(`UPDATE slides SET data=$1 WHERE slideID=$2`, [data, slideID]);
            response = DB_RESPONSES.OK;
        } catch (error){
          console.log(error);
        }
        return response;
    }

    
    return {
        getUser: getUserByID,
        getUserByName: getUserByName,
        insertNewUser: insertUser,
        deleteExistingUser: deleteUser,
        updateExitingUser: updateUser,

        insertNewPresentation: insertPresentation,
        deleteExistingPresentation: deletePresentation,
        updateExitingPresentation: udpatePresentation,
        getPresentations: getPresentationsByUserID,
        publicPresentations: getPublicPresentations,
        sharePresentation: sharePresentation,

        updateExitingSlide: updateSlide,
        insertNewSlide: insertSlide,
        deleteExistingSlide: deleteSlide,
        getSlides: getSlidesByPresID
    }
}

module.exports = db;