const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const connection = require('../db');

router.post('/player', async (req, res) => {
    const classId = uuidv4();
    const playerId = uuidv4();

    const { Mana, Health, PlayerName, Armour, WeaponDam, WeaponName, WeaponRange, ClassName } = req.body;

    // Insert Class first, then Player inside the callback to avoid race condition
    connection.query(
        'INSERT INTO Class (ClassId, Armour, WeaponDam, WeaponName, WeaponRange, ClassName) VALUES (?,?,?,?,?,?)',
        [classId, Armour, WeaponDam, WeaponName, WeaponRange, ClassName],
        (err) => {
            if (err) return res.status(500).json({ error: 'Class insert failed', details: err.message });

            connection.query(
                'INSERT INTO Player (PlayerId, ClassId, Mana, Health, PlayerName) VALUES (?,?,?,?,?)',
                [playerId, classId, Mana, Health, PlayerName],
                (err) => {
                    if (err) return res.status(500).json({ error: 'Player insert failed', details: err.message });

                    res.status(200).json({ PlayerId: playerId });
                }
            );
        }
    );
});

module.exports = router;