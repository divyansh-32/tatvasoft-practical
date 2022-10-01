const express = require('express');
const { blogs, users } = require('../mongodb/mongoModel');

const route = express.Router();

route.post('/createBlogs', (req, res) => {
    const blog = new blogs(req.body);
    blog.save().then((data) => {
        res.status(200).send(data);
    })
        .catch((err) => {
            res.status(400).json({ 'message': err.message });
        })
})

route.get('/listBlogs', (req, res) => {
    const filter = req?.query?.date ? { published_date: req.query.date } 
                    : req?.query?.author ? { author: req.query.author } 
                    : req?.query?.category ? { category: req.query.category } 
                    : null;
    if(req?.body?.role === 'Admin') {
        blogs.find(filter).then((data) => {
            res.status(200).send(data)
        })
            .catch((err) => {
                res.status(400).json({ message: err.message });
            })
    } else if(req?.body?.role === 'User'){
        blogs.find({...filter, author: req?.body?.author}).then((data) => {
            res.status(200).send(data)
        })
            .catch((err) => {
                res.status(400).json({ message: err.message });
            })
    } else {
        res.status(400).json({message: "Role is not in the request body"});
    }
})

route.patch('/updateBlogs/:id', (req, res) => {
    if(req?.body?.role === "Admin") {             // sending role, author through body will be a secure option
        blogs.findByIdAndUpdate(req.params?.id, req.body.data).then((data)=>{
            res.status(200).json({message: "Successfully updated blog"});
        }).catch((err)=>{
            res.status(400).json({message: err.message});
        })
    } else if(req?.body?.role === "User") {
        blogs.findById(req?.params.id).then((data)=>{
            if(data?.author === req?.body.author) {
                blogs.findByIdAndUpdate(req.params?.id, req.body.data).then((data)=>{
                    res.status(200).json(data);
                }).catch((err)=>{
                    res.status(400).json({message: err.message});
                })
            } else {
                res.status(400).json({message: "cannot update blog, author doesn't own this blog "})
        }
        })
    } else {
        res.status(400).json({message: "Cannot update blog, need author role"})
    }
})

route.delete('/deleteBlogs/:id', (req, res) => {
    if(req.body.role === "Admin") {         // sending role, author through body will be a secure option
        blogs.findByIdAndDelete(req.params.id).then((data)=>{
            res.status(200).json({message: "Record is deleted"});
        }).catch((err)=>{
            res.status(400).json({message: err.message});
        })
    } else if(req.body.role === "User") {
        blogs.findById(req.params.id).then((data)=>{
            if(data.author === req.body.author) {
                blogs.findByIdAndDelete(req.params.id).then((data)=>{
                    res.status(200).json({message: "Record is deleted"});
                }).catch((err)=>{
                    res.status(400).json({message: "Different author cannot delete as User"});
                })
            } else {
                    res.status(400).json({message: "cannot delete blog, author doesn't own this blog "})
            }
        })
    } else {
        res.status(400).json({message: "cannot delete blog, need role"})
    }
})

route.post('/userRegister', (req, res) => {
    users.find({ email: req.body.email }).then((data) => {
        if (data) {
            res.status(401).json({ message: "User already exist" })
        } else {
            const user = new users(req.body)
            user.save().then((data) => {
                res.status(200).send(data);
            })
                .catch((err) => {
                    res.status(400).json({ 'message': err.message });
                })
        }
    })
})

module.exports = route;