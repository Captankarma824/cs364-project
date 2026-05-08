const express = require('express');
const router = express.Router();
const connection = require('../db');

router.get('', async (req, res) => {
    console.log('Hit Get Query');
    let data = req.query.data;
    let number = req.query.number;

    switch (number) { //need to figure out all but 5 James please :3
        case '1':
            connection.query(
                `SELECT SUM(Enemies.Health) AS TotalHealth, Location.Background
                FROM Enemies JOIN SpawnIN ON Enemies.BiomeID = SpawnIN.BiomeID
                JOIN Location ON SpawnIN.BiomeId = Location.BiomeId
                WHERE Location.Background = ?;
                `,
                [data],
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        case '2':
            connection.query(
                `SELECT PlayerClasses.ClassId, COUNT(PlayerClasses.PlayerId) AS PlayersUsingClass,
                (COUNT(PlayerClasses.PlayerId) * 100.0 / (SELECT COUNT(Player.PlayerId) FROM Player)) AS UsagePercentage
                FROM (SELECT Player.PlayerId, Player.ClassId
                FROM Player) AS PlayerClasses
                GROUP BY PlayerClasses.ClassId`,
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        case '3':
            connection.query(
                `SELECT AVG(ClassPlayers.WeaponDam) AS AverageClassDamage
                FROM (SELECT Player.PlayerId, Class.WeaponDam, Class.ClassName
                FROM Player NATURAL JOIN Class
                WHERE Class.ClassName = ?) AS ClassPlayers
                GROUP BY ClassPlayers.ClassName`,
                [data],
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        case '4':
            connection.query(
                `SELECT WeaponUsage.ClassName, WeaponUsage.WeaponName, COUNT(WeaponUsage.PlayerId) AS TimesUsed
                FROM (SELECT Player.PlayerId, Class.ClassName, Class.WeaponName
                FROM Player NATURAL JOIN Class) AS WeaponUsage
                GROUP BY WeaponUsage.ClassName, WeaponUsage.WeaponName
                HAVING COUNT(WeaponUsage.PlayerId) = 
                (SELECT MAX(WeaponTotals.TotalPlayers)
                FROM (SELECT COUNT(Player.PlayerId) AS TotalPlayers, Class.ClassName, Class.WeaponName
                FROM Player JOIN Class ON Player.ClassId = Class.ClassId
                GROUP BY Class.ClassName, Class.WeaponName ) AS WeaponTotals
                WHERE WeaponTotals.ClassName = WeaponUsage.ClassName);
`,
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        case '5':
            connection.query(
                `SELECT AVG(LootStats.ExpectedKills) AS AverageEnemiesNeeded, LootStats.Loot, LootStats.EnemyName
                FROM (SELECT Enemies.Loot, (100.0 / Enemies.LootPerc) AS ExpectedKills, Enemies.EnemyName
                FROM Enemies
                WHERE Enemies.Loot = ? ) AS LootStats
                GROUP BY LootStats.Loot, LootStats.EnemyName;
                `,
                [data],
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        case '6':
            connection.query(
                `
                SELECT EnemyTotals.Background, COUNT(EnemyTotals.EnemyId) AS NumberOfEnemies
                FROM (SELECT SpawnIN.BiomeId, Location.Background, SpawnIN.EnemyId
                FROM SpawnIN JOIN Location ON SpawnIN.BiomeId = Location.BiomeId) AS EnemyTotals
                GROUP BY EnemyTotals.BiomeId
                HAVING COUNT(EnemyTotals.EnemyId) = 
                (SELECT MAX(LocationTotals.TotalEnemies)
                FROM (SELECT COUNT(SpawnIN.EnemyId) AS TotalEnemies, SpawnIN.BiomeId
                FROM SpawnIN
                GROUP BY SpawnIN.BiomeId) AS LocationTotals);
                `,
                (err, results) => {
                    if (err) return res.status(500).json({ error: err.message });
                    return res.status(200).json(results);
                }
            );
            break;

        default:
            return res.status(400).json({ error: 'Invalid query number' });
    }
});

module.exports = router;