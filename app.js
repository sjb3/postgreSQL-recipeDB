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

app.get('/', (req, res) => {
  // PG connect
  pg.connect(connect, (err, client, done) => {
    if(err){
      return console.error('error fetching client from pool', err)
    }
    //execute a query on our db
    client.query('SELECT * FROM recipe', (err, result) => {
      if(err) throw err;
      //just print the result to the console
      res.render('index', {recipes: result.rows});
      done();
    })
  })
});

app.post('/add', (req, res) => {
  // PG connect
  pg.connect(connect, (err, client, done) => {
    if(err) return console.error('error fetching client from pool', err)

    //execute a query on our db
    client.query("INSERT INTO recipe(name, ingredients, directions) VALUES($1, $2, $3)",
      [req.body.name, req.body.ingredients, req.body.directions]);

      done();
      res.redirect('/');
  });
});

app.delete('/delete/:id', (req, res) => {
  pg.connect(connect, (err, client, done) => {
    if(err) return console.error('error fetching client from pool', err)

    //execute a query on our db
    client.query("DELETE FROM recipe WHERE id = $1", [req.params.id]);//get the id from URL

      done();
      res.sendStatus(200);
  });
});

app.post('/edit', (req, res) => {
  pg.connect(connect, (err, client, done) => {
    if(err) return console.error('error fetching client from pool', err)

    //execute a query on our db
    client.query("UPDATE recipe SET name=$1, ingredients=$2, directions=$3 WHERE id=$4",
    [req.body.name, req.body.ingredients, req.body.directions, req.body.id]);//get the id from URL

      done();
      res.redirect('/');
  });
});

//Server
app.listen(3000, () => {
  console.log('Server UP <8))><~ on: port 3000');
});
