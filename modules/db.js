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

    async function insertData(query, params) {
        const client = new pg.Client(connectionString);
        await client.connect();
        await client.query(query, params);
        await client.end();
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
                await insertData(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`, [userName, userEmail, userPassword]);
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
                await insertData(`DELETE FROM users WHERE userID=$1`, [userID]);
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
                    await insertData(`UPDATE users SET name=$2, email=$3, password=$4 WHERE userID=$1`, [userID, userName, userEmail, userPassword]);
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
        try{
            presentationData = await runQueryAll(`SELECT * FROM presentations WHERE ownerID=$1`, [ownerID]);
        } catch(error) {
            console.error(error);
        }
        return presentationData;
    }

    const insertPresentation = async function (presentationName, ownerID, theme) {
        let response = null;
        try {
            await insertData(`INSERT INTO presentations(name, slides, ownerID, sharedUsers, theme) VALUES ($1, '{}', $2, '{}', $3)`, [presentationName, ownerID, theme]);
            response = DB_RESPONSES.OK;
        } catch (error) {
            console.error(error);
        }

        return response;
    }

    const deletePresentation = async function (presentationID) {
        let response = null;
        
            try {
                await insertData(`DELETE FROM presentations WHERE presentationID=$1`, [presentationID]);
                response = DB_RESPONSES.OK;
            } catch (error) {
                console.error(error);
            }
        
        return response;
    }

    const udpatePresentation = async function (presentationName, theme, presentationID) {
        let response = null;
        try {
            await insertData(`UPDATE presentations SET name=$1, theme=$2 WHERE presentationID=$3`, [presentationName, theme, presentationID]);
            response = DB_RESPONSES.OK;
        } catch(error) {
            console.error(error);
        }
        return response;
    }

// ----------------------- Slide ---------------------------------


    const deleteSlide = async function (slideID) {
    let response = null;
        
        try{
            await insertData(`DELETE FROM slides WHERE slideID=$1`, [slideID]);
            response = DB_RESPONSES.OK;
        } catch (error){
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
        deleteExistingSlide: deleteSlide,
        updateExitingSlide: updateSlide
    }
}

module.exports = db;