const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const userRoutes = require('./routes/users');

const DEFAULT_PORT = 8080;
app.set('port', (process.env.PORT || DEFAULT_PORT));


app.use('/user', userRoutes);
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.status(200).json("test");
})


// start server------------------------------
app.listen(app.get('port'), function(){
    console.log("server running ", app.get('port'));
});