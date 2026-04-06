const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

//router to get from sql Server
router.get('/', async (req, res) =>{
    connection.query(
        'SELECT * FROM users WHERE id = ?',
        [1], // Use parameters to prevent SQL injection
        (err, results) => {
            if (err) throw err;
            console.log(results); // Results are returned as JS objects
        }
    );
});

module.exports = router;