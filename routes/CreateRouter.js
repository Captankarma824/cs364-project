const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const connection = require('../db');

//router to post to sql Server
router.all('/player', async (req, res) =>{
    let classId = uuidv4();
    let playerId = uuidv4();

    //query to make new class on the server
    connection.query(
        'INSERT INTO Class VALUES (?,?,?,?,?)',
        [classId, req.body.armour, req.body.weaponDamage, req.body.weaponName, req.body.weaponRange], // class id uuidv4, armour int, weaponDam int, weaponName string, weaponRange int
        (err, results) => {
            if (err) throw err;
            return console.log(results); 
        }
    );
    //query to make new player on server
    connection.query(
        'INSERT INTO Player VALUES (?,?,?,?)',
        [playerId, classId, req.body.mana, req.body.health], // player id uuidv4, class id uuidv4, mana int, health int
        (err, results) => {
            if (err) throw err;
            return console.log(results); 
        }
    );

    res.status(200).json({PlayerId: playerId});

});

module.exports = router;