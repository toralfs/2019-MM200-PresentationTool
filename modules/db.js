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


    
    const getUserByID = async function(userID) {
        let userData = null;
        try {
            userData = await runQuery(`SELECT * FROM users WHERE userID=$1`, [userID]);
        } catch(error) {
            console.error("someting wrong", error);
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

    return {
        getUser: getUserByID,
        insertNewUser: insertUser
    }
}

module.exports = db;