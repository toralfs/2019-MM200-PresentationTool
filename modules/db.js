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

    async function insertData(query, params) {
        const client = new pg.Client(connectionString);
        await client.connect();
        await client.query(query, params);
        await client.end();
    }

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

    const updateUser = async function (userID, userName, userEmail, userPassword) {
        let response = null;
        let userToUpdate = await getUserByID(userID);
        if (userToUpdate) {
            let usernameCheck = await getUserByName(userName);
            let useremailCheck = await getUserByEmail(userEmail);

            if (usernameCheck && usernameCheck.name !== userToUpdate.name) {
                response = DB_RESPONSES.ALREADY_EXIST;
            } else if(useremailCheck && useremailCheck.email !== userToUpdate.email) {
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


    return {
        getUser: getUserByID,
        getUserByName: getUserByName,
        insertNewUser: insertUser,
        deleteExistingUser: deleteUser,
        updateExitingUser: updateUser,
        deleteExistingPresentation: deletePresentation
    }
}

module.exports = db;