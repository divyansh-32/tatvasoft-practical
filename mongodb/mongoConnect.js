const mongoose = require("mongoose");
const config = require('config');

mongoose.connect(config.get("mongoUri"))
.then(res => console.log("Connected to MongoDB"))
.catch(err => console.log("Unable to connect to MongoDB"))