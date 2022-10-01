const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 15,
        required: true
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 15,
    },
    dateOfBirth: {
        type: String,
        max: moment().format("DD-MM-YYYY"),
        required: true,
    },
    email: {
        type: String,
        validate(value) {
            if(!value.match(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/)) {
                throw new Error("Enter a valid email");
            }
        }
    },
    role: {
        type: String,
        required: true,
        enum: ['Admin', 'User']
    },
    password: {
        type: String,
        required: true,
        maxlength: 15,
        minlength: 8,
        validate(value) {
            if(!value.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)) {
                throw new Error("Enter a valid password");
            }  
        }
    }
})

const blogsSchema = new mongoose.Schema({
    title: {
        require: true,
        type: String, 
        minlength: 3,
        maxlength: 15 
    },
    description: {
        required: true,
        type: String,
    },
    published_date: {
        type: String,
        max: moment().format('DD-MM-YYYY'),
    },
    modify_date: {
        type: String,
        max: moment().format('DD-MM-YYYY'),
    },
    status: {
        type: String,
        required: true,
        enum: ['published', 'unpublished', 'Published', 'Unpublished', 'PUBLISHED', 'UNPUBLISHED']
    },
    author: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15
    },
    category: {
        type: Object,
        required: true,
    }
})


const blogs = mongoose.model("blogsSchema", blogsSchema);
const users = mongoose.model("userSchema", userSchema);


module.exports = {
    blogs,
    users
};