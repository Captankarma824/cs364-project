const express = require('express');
const router = express.Router();
const connection = require('../db');

//router to get from sql Server
router.get('/enemy', async (req, res) => {
    const enemy = req.query;

    connection.query(
        'SELECT * FROM Enemies WHERE EnemyName = ?', [enemy.EnemyName],
        (err, results) => {
            if (err) {
                throw err;
            }
            //on success
            return res.status(200).json(results[0]);
        }
    );
});

router.get('/location', async (req, res) => {
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
module.exports = router;