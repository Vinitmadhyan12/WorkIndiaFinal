const express = require('express');
const app = express();
const mysql = require('mysql');
const bodyParser = require('body-parser');
const dotenv = require("dotenv");

const { v4: uuidv4 } = require('uuid');
const cors = require("cors");


const userRoutes = require("./routes/user")
const diningRoute = require("./routes/dining.js")
const db = require('./data.js');

dotenv.config();

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = process.env.PORT;


app.get('/', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }
        res.json(results);
    });
});






app.use("/api", userRoutes);
app.use("/api/dining-place", diningRoute);


app.listen(port, () => {
    console.log(`server running on port ${port}`);
})