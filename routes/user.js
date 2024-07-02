const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data.js');

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";


router.post('/signup', async (req, res) => {

    const data = req.body;
    const pass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const value = await bcrypt.hash(pass, salt);


    var sql = "insert into user (user_id,username,email,password,isAdmin) values(?,?,?,?,?)";

    db.query(sql, [uuidv4(), data.username, data.email, value, data.isadmin ? true : false], (err, result) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        res.send("data added sucessfully");
    })



})

router.post('/login', async (req, res) => {

    const data = req.body;
    const pass = req.body.password;

    var sql = "select * from user where username=?";

    db.query(sql, [data.username], async (err, result) => {
        if (err) {
            console.log(err);
        }

        console.log(result[0]);
        const user = result[0];
        const isMatch = await bcrypt.compare(pass, user.password);

        if (isMatch) {
            console.log(user);
            jwt.sign({ user }, secretKey, { expiresIn: '6000s' }, (err, token) => {
                res.json({ "status": "Login successful", "user_id": user.user_id, "access_token": token });
            })

        } else {
            res.status(401).send("Incorrect username/password provided. Please retry");


        }


    })
})


module.exports = router;