var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser')

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});


app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port',4000);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.get('/',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);
    //console.log(context.result);
    res.render('home', context);
  });
});

app.get('/edit',function(req,res,next){
  var context = {};
  mysql.pool.query('SELECT * FROM workouts WHERE id = "' + req.body.id + '"',
    function(err, result, fields) {
        if(err) {
          res.status(400);
          res.json('ERROR!');
          return;
        }

        res.status(200);
        res.render('edit', context);
    });
});


app.get('/reset-table',function(req,res,next){
  var context = {};
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err){ //replace your connection pool with the your variable containing the connection pool
    var createString = "CREATE TABLE workouts("+
    "id INT PRIMARY KEY AUTO_INCREMENT,"+
    "name VARCHAR(255) NOT NULL,"+
    "reps INT,"+
    "weight INT,"+
    "date DATE,"+
    "lbs BOOLEAN)";
    mysql.pool.query(createString, function(err){
      context.results = "Table reset";
      //console.log(context.result);
      res.render('home',context);
    })
  });
});

app.post('/save-data', function(req, res, next) {
  var name = req.body.name,
      reps = req.body.reps,
      weight = req.body.weight,
      date = req.body.date,
      unit = req.body.unit;

      console.log(date);

      mysql.pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ('" + name + "', '" +
                                                                                        + reps + "', '" +
                                                                                        + weight + "', STR_TO_DATE('" + date + "', '%Y-%m-%d'), '" +
                                                                                        + unit + "')",
                                function(err, result){

                                    if(err){
                                      //next(err);
                                      //return;
                                      res.status(400);
                                      res.json();
                                      return;
                                    }

                                    res.status(200);
                                    res.json(result.insertId);
                                  });
      //res.render('home',"context");
});


app.post('/save-workout', function(req, res, next) {
  var name = req.body.name,
      reps = req.body.reps,
      weight = req.body.weight,
      date = req.body.date,
      unit = req.body.unit,
      id = req.body.id;

      var sqlQuery = "UPDATE workouts SET name='" + name + "', " +
                                            " reps='" + reps + "', " +
                                            " weight='" + weight + "', " +
                                            " date='" + date + "', " +
                                            " lbs='" + unit + "' " +
                                            " WHERE id=" + id + " "

      console.log(sqlQuery);

      mysql.pool.query(sqlQuery,
                                function(err, result){

                                    if(err){
                                      //next(err);
                                      //return;
                                      res.status(400);
                                      console.log(err);
                                      res.json();
                                      return;
                                    }

                                    res.status(200);
                                    res.json(result.insertId);
                                  });
      //res.render('home',"context");
});

/*
app.post('/save-data', function(req, res, next) {
    console.log("==DATA==");
    console.log(req.body);
    console.log("==DATA==");
    var name = req.body.name,
        reps = req.body.reps,
        weight = req.body.weight,
        date = req.body.date,
        unit = req.body.unit;
    console.log(name);
    mysql.pool.query("INSERT INTO workouts (name, reps, weight, date, lbs) VALUES ('" + name + "', '" +
                                                                                      + reps + "', '" +
                                                                                      + weight + "', '" +
                                                                                      + date + "', '" +
                                                                                      + unit + "')",
                              function(err, result){
                                  if(err){ next(err); return; }
                                });
    res.render('home',"context");
});
*/

app.get('/get-data', function(req, res, next) {
  mysql.pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date, '%Y-%m-%d') as date, lbs FROM workouts",
  function(err, result, fields) {
      if (err) throw err;
      else {
          console.log(result);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
      }
  });
});


app.get('/get-workout', function(req, res, next) {
  console.log(req.query.id);
  var sqlQuery = "SELECT id, name, reps, weight, DATE_FORMAT(date, '%Y-%m-%d') as date, lbs FROM workouts WHERE id='" + req.query.id + "'";
  console.log(sqlQuery);
  mysql.pool.query(sqlQuery,
  function(err, result, fields) {
      if (err) throw err;
      else {
          console.log(result);
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
      }
  });
});


app.post('/delete-data', function(req, res){
  //console.log('my id is: ' + req.body.id);
    mysql.pool.query('DELETE FROM workouts WHERE id = "' + req.body.id + '"',
    function(err, result, fields) {
        if(err) {
          res.status(400);
          res.json('');
          return;
        }

        res.status(200);
        res.json('');
    });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://52.35.65.72:' + app.get('port') + '; press Ctrl-C to terminate.');
});
