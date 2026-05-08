const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('', async (req, res) => {
    console.log('Hit Get Query');
    let data = req.query.data;
    let number = req.query.number;

    //choose query to run
    switch (number) {
        case (1):
            connection.query( // needs to be redone
                `SELECT SUM(EnemyIN.Health) AS TotalEnemyHealth, Location.Background
                FROM( SELECT Enemies.Health, Enemies.EnemyID, SpawnIN.BiomeId
	            FROM Enemies NATURAL JOIN SpawnIN
	            WHERE SpawnIN.BiomeID = "Surface" ) AS EnemyIN
                JOIN Location ON Location.BiomeId = EnemyIN.BiomeId GROUP BY Location.Background;
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;

        case (2):
            connection.query( // not sure whats going on here
                `SELECT PlayerClasses.ClassId, COUNT(PlayerClasses.PlayerId) AS PlayersUsingClass,
                (COUNT(PlayerClasses.PlayerId) * 100.0 / (SELECT COUNT(Player.PlayerId) FROM Player)) AS UsagePercentage
                FROM (SELECT Player.PlayerId, Player.ClassId
	            FROM Player) AS PlayerClasses
                GROUP BY PlayerClasses.ClassId;
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;

        case (3):
            connection.query( // may need to be redone
                `SELECT AVG(ClassPlayers.WeaponDam) AS AverageClassDamage
                FROM( SELECT Player.PlayerId, Class.WeaponDam, Class.ClassId
                FROM Player NATURAL JOIN Class
                WHERE Class.ClassName = ${data}) AS ClassPlayers
                GROUP BY ClassPlayers.ClassName;
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;

        case (4):
            connection.query( // may need to be redone
                `SELECT WeaponUsage.ClassId, WeaponUsage.WeaponName, COUNT(WeaponUsage.PlayerId) AS TimesUsed
                FROM (SELECT Player.PlayerId, Class.ClassId, Class.WeaponName
                FROM Player NATURAL JOIN Class) AS WeaponUsage
                GROUP BY WeaponUsage.ClassId, WeaponUsage.WeaponName
                HAVING COUNT(WeaponUsage.PlayerId) = 
                (SELECT MAX(WeaponTotals.TotalPlayers)
                FROM (SELECT COUNT(Player.PlayerId) AS TotalPlayers, Class.ClassId, Class.WeaponName
                FROM Player NATURAL JOIN Class
                GROUP BY Class.ClassId, Class.WeaponName ) AS WeaponTotals
                WHERE WeaponTotals.ClassId = WeaponUsage.ClassId);
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;
        case (5):
            connection.query( 
                `SELECT AVG(LootStats.ExpectedKills) AS AverageEnemiesNeeded, LootStats.Loot
                FROM (SELECT Enemies.Loot, (100.0 / Enemies.LootPerc) AS ExpectedKills
                FROM Enemies
                WHERE Enemies.Loot = ${data}) AS LootStats
                GROUP BY LootStats.Loot;
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;
        case (6):
            connection.query( // may need to be redone
                `SELECT EnemyTotals.BiomeId, COUNT(EnemyTotals.EnemyId) AS NumberOfEnemies
                FROM (SELECT SpawnIN.BiomeId, SpawnIN.EnemyId
                FROM SpawnIN) AS EnemyTotals
                GROUP BY EnemyTotals.BiomeId
                HAVING COUNT(EnemyTotals.EnemyId) = 
                (SELECT MAX(LocationTotals.TotalEnemies)
                FROM (SELECT COUNT(SpawnIN.EnemyId) AS TotalEnemies, SpawnIN.BiomeId
                FROM SpawnIN
                GROUP BY SpawnIN.BiomeId) AS LocationTotals);
                `,
                (err, results) => {
                    if (err) throw err;
                    return res.status(200).json(results);
                }
            );
            break;
    }
});

module.exports = router;