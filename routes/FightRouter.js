const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

//router to post to sql Server
router.post('/', async (req, res) =>{
    classId = uuidv4();
    playerId = uuidv4();

    //query to make new class on the server
    connection.query(
        'USE volkmann5333_Terraria; INSERT INTO Class VALUES (\'?\',?,?,\'?\',?)',
        [classId, req.body.armour, req.body.weaponDamage, req.body.weaponName, req.body.weaponRange], // class id uuidv4, armour int, weaponDam int, weaponName string, weaponRange int
        (err, results) => {
            if (err) throw err;
            console.log(results); 
        }
    );
    //query to make new player on server
    connection.query(
        'USE volkmann5333_Terraria; INSERT INTO Player VALUES (\'?\',\'?\',?,?)',
        [playerId, classId, req.body.mana, req.body.health], // player id uuidv4, class id uuidv4, mana int, health int
        (err, results) => {
            if (err) throw err;
            console.log(results); 
        }
    );

    //query to get 

    res.status(200).json('success add');

});

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