const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../data.js');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = "secretKey";


router.get('/', async (req, res) => {

    const name = req.query.name;;
    console.log(name);

    const sql = "SELECT * FROM place WHERE name = ?";

    db.query(sql, [name], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching data');
        }

        console.log("Results:", results);
        const arr = await find(results[0].id);
        console.log(arr);
        res.send("done");


    });

})

async function find(id) {
    const sql = "SELECT * FROM booked_slots WHERE place_id = ?";
    const resu = await queryDb(sql, [id]);
    console.log("Results:", resu);
    return resu;
}

function queryDb(sql, params) {
    return new Promise((resolve, reject) => {
        db.query(sql, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });
}


router.get('/availability', (req, res) => {

    const name = req.params;
    console.log(name);

    const sql = "SELECT * FROM place WHERE name = ?";

    db.query(sql, [name], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error fetching data');
        }

        console.log("Results:", results);
        const arr = find(results[0].id);
        console.log(arr);
        res.send("done");


    });

})



async function verifyToken(req, res, next) {
    const head = req.headers['authorization'];

    console.log(head);

    if (typeof head !== 'undefined') {
        await jwt.verify(head, secretKey, (err, data) => {
            if (err) {
                res.send({ result: "invalid token" });
            } else {
                req.user = data;
                next();
            }
        })


    } else {
        res.send({ result: "not a valid token" });
    }
}
function verifyAdmin(req, res, next) {
    const { user } = req.user;


    if (user.isadmin) {
        next();

    } else {
        res.send("you are not admin");
    }

}



router.post('/create', verifyToken, verifyAdmin, async (req, res) => {

    const data = req.body;

    console.log(req.user);
    var sql = "insert into place (name,address,phone_no,website,open_time,close_time) values(?,?,?,?,?,?)";

    db.query(sql, [data.name, data.address, data.phone_no, data.website, data.open_time, data.close_time], (err, result, field) => {
        if (err) {
            console.log(err);
        }
        console.log(result);
        console.log(field);

        res.json({ "message": "data added sucessfully", "place_id": result.insertId });
    })



})

module.exports = router;
