const pg = require('pg');

const db = function(dbConnectionString) {
    const connectionString = dbConnectionString;

    async function runQuery(query) {
        const client = new pg.Client(connectionString);
        await client.connect();
        const res = await client.query(query);
        let response = res.rows[0];
        await client.end();
        return response;
    }

    const getUserByID = async function(userID) {
        console.log(userID);
        let userData = null;
        try {
            userData = await runQuery(`SELECT * FROM users`);
            console.log(userData);
        } catch(error) {
            console.error("someting wrong");
        }
        return userData;
    }

    return {
        getUser: getUserByID
    }
}

module.exports = db;