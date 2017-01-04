'use strict';

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cons from 'consolidate';
import dust from 'dustjs-helpers';
import pg from 'pg';

const app = express();

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
app.use(bodyParser.urlencoder({ extended: false }));

app.get('/', function(req, res){
  console.log('Do not panic, testing!');
});

//Server
app.listen(3000, function(){
  console.log('Server UP <8))><~ on: port', port);
})
