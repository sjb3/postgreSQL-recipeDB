'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cons = require('consolidate'),
    dust = require('dustjs-helpers'),
    pg = require('pg'),
    app = express();

//DB connection string
//var conString = 'postgres://username:password@localhost/database';
let connect = 'postgres://initial:1234@localhost/recipebookDB';

//Assign Dust Engine to .dust files
app.engine('dust', cons.dust);

//Set defaut ext .dust
app.set('view engine', 'dust');
app.set('views', __dirname + '/views');

//Set public folder
app.use(express.static(path.join(__dirname, 'public')))

//Body Parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res){
  // PG connect
  pg.connect(connect, function(err, client, done){
    if(err){
      return console.error('error fetching client from pool', err)
    }
    //execute a query on our db
    client.query('SELECT * FROM recipe', function(err, result){
      if(err) throw err;
      //just print the result to the console
      res.render('index', {recipes: result.rows});
      done();
      //disconnect the client
    })
  })
});

//Server
app.listen(3000, function(){
  console.log('Server UP <8))><~ on: port 3000');
});
