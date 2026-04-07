const mysql = require('mysql2');

//sql connecttion
const connection = mysql.createConnection({
  host: '138.49.184.123',
  port: 3306,
  user: 'matthai9755',
  password: 'tN2Smzvv!fnfJEBFS',
  database: 'volkmann5333_Terraria'
});

// Connect to the database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the SQL database!');
});

module.exports = connection;