
// Ubuntu configuration
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'student',
  password        : 'default',
  database        : 'studentdb',
  dateString      : true
});

module.exports.pool = pool;


/*
// local configuration
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : '52.35.65.72',
  user            : 'student',
  database        : 'studentdb',
  port            : 3306
});

module.exports.pool = pool;
*/
