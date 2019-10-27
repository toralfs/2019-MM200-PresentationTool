const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const DEFAULT_PORT = 8080;
app.set('port', (process.env.PORT || DEFAULT_PORT));

//const userRoutes = require('./routes/users');
//app.use('/user', userRoutes);

app.get('/', (req, res, next) => {
    res.status(200).json("test");
})


// start server------------------------------
app.listen(app.get('port'), function(){
    console.log("server running ", app.get('port'));
});