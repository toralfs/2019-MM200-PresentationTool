const pg = require('pg');

const db = function(dbConnectionString) {
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


    const getUserByName = async function(userName) {
        let userData = null;
        try {
            userData = await runQuery('SELECT * FROM users WHERE name=$1', [userName]);
        } catch(error) {
            console.error(error);
        }
        return userData;
    }
    
    const getUserByID = async function(userID) {
        let userData = null;
        try {
            userData = await runQuery(`SELECT * FROM users WHERE userID=$1`, [userID]);
        } catch(error) {
            console.error(error);
        }
        return userData;
    }

    const insertUser = async function(userName, userEmail, userPassword) {
        try {
            await insertData(`INSERT INTO users(name, email, password) VALUES ($1, $2, $3)`, [userName, userEmail, userPassword]);
        } catch(error) {
            console.error(error);
        }
    }

    const deleteUser = async function(userID) {
        try {
            await insertData(`DELETE FROM users WHERE userID=$1`, [userID]);
        } catch(error) {
            console.error(error);
        }
    }

    const updateUser = async function(userID, userName, userEmail, userPassword) {
        try {
            await insertData(`UPDATE users SET name=$2, email=$3, password=$4 WHERE userID=$1`, [userID, userName, userEmail, userPassword]);
        } catch(error) {
            console.error(error);
        }
    }

    return {
        getUser: getUserByID,
        getUserByName: getUserByName,
        insertNewUser: insertUser,
        deleteExistingUser: deleteUser,
        updateExitingUser: updateUser
    }
}

module.exports = db;