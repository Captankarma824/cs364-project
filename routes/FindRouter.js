const express = require('express');
const router = express.Router();
const connection = require('../db');

//router to get enemy from sql Server
router.get('/enemy', async (req, res) => {
    console.log('Hit Get Enemy');
    let Enemy = req.query;

    // Whitelist valid values to prevent SQL injection
    const validSortColumns = ['EnemyName', 'Health', 'Damage', 'Loot'];
    const validOrders = ['ASC', 'DESC'];

    const sortBy = validSortColumns.includes(Enemy.sort) ? Enemy.sort : 'EnemyName';
    const orderBy = validOrders.includes(Enemy.orderBy) ? Enemy.orderBy : 'ASC';

    connection.query(
        `SELECT * FROM Enemies NATURAL JOIN Location ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
        [5, (Enemy.page ?? 0) * 5],
        (err, results) => {
            if (err) throw err;
            return res.status(200).json(results);
        }
    );
});

//router to get location from sql server
router.get('/location', async (req, res) => {
    console.log('Hit Get Location');
    let Location = req.query;

    // Whitelist valid values to prevent SQL injection
    const validOrders = ['ASC', 'DESC'];

    const orderBy = validOrders.includes(Location.orderBy) ? Location.orderBy : 'ASC';

    connection.query(
        `SELECT * FROM Location ORDER BY Background ${orderBy} LIMIT ? OFFSET ?`,
        [5, (Location.page ?? 0) * 5],
        (err, results) => {
            if (err) throw err;
            return res.status(200).json(results);
        }
    );
});

//router to get class from sql server
router.get('/class', async (req, res) => {
    console.log('Hit Get Class');
    let Class = req.query;

    // Whitelist valid values to prevent SQL injection
    const validSortColumns = ['ClassName', 'Armour', 'WeaponName', 'WeaponDam', 'WeaponRange'];
    const validOrders = ['ASC', 'DESC'];

    const sortBy = validSortColumns.includes(Class.sort) ? Class.sort : 'ClassName';
    const orderBy = validOrders.includes(Class.orderBy) ? Class.orderBy : 'ASC';

    connection.query(
        `SELECT * FROM Class ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
        [5, (Class.page ?? 0) * 5],
        (err, results) => {
            if (err) throw err;
            return res.status(200).json(results);
        }
    );
});

//router to get player from sql server
router.get('/player', async (req, res) => {
    console.log('Hit Get Player');
    let Player = req.query;

    // Whitelist valid values to prevent SQL injection
    const validSortColumns = ['PlayerName', 'Health', 'ClassName'];
    const validOrders = ['ASC', 'DESC'];

    const sortBy = validSortColumns.includes(Player.sort) ? Player.sort : 'PlayerName';
    const orderBy = validOrders.includes(Player.orderBy) ? Player.orderBy : 'ASC';

    connection.query(
        `SELECT * FROM Player NATURAL JOIN Class ORDER BY ${sortBy} ${orderBy} LIMIT ? OFFSET ?`,
        [5, (Player.page ?? 0) * 5],
        (err, results) => {
            if (err) throw err;
            return res.status(200).json(results);
        }
    );
});
module.exports = router;