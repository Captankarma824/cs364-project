const express = require('express');
const router = express.Router();
const connection = require('../db');

//router to get from sql Server
router.get('/enemy', async (req, res) => {
    console.log('Hit Get Enemy');
    let Enemy = req.query;

    // Whitelist valid values to prevent SQL injection
    const validSortColumns = ['EnemyName', 'Health', 'Damage', 'Loot' ];
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
    const location = req.query;

    connection.query(
        'SELECT * FROM Location WHERE Background = ?', [location.LocationName],
        (err, results) => {
            if (err) {
                throw err;
            }
            //on success
            return res.status(200).json(results[0]);
        }
    );
});

//router to get location from sql server
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