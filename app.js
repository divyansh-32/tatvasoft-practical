const express = require('express');
const config = require('config');
const mongoConnect = require('./mongodb/mongoConnect');
const routes = require('./routes/routes');

const app = express();

app.use(express.json());
app.use(routes);

app.listen(config.get('PORT'), ()=>{
    console.log(`Server has started at port: ${config.get('PORT')}`);
})