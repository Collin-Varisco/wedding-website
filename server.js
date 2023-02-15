const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const ejs = require('ejs');

const app = express();
app.set("views", "./views");
app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended: false}));

const server = require("http").Server(app);
server.listen(8080, 'localhost');


// Home Page
app.get('/', function(req, res) {
	res.render("index.ejs");
});

app.get('/registry', function(req, res) {
	res.render("registry.ejs");
});

app.get('/index', function(req, res) {
	res.render("index.ejs");
});

app.get('/when-where', function(req, res) {
	res.render("when-where.ejs");
});

app.get('/hotels', function(req, res) {
  res.render("hotels.ejs");
});

app.get('/guest', function(req, res) {
	res.render("guest.ejs");
});

app.get('/gallery', function(req, res) {
	res.render("gallery.ejs");
});

app.get('/blog', function(req, res) {
	res.render("blog.ejs");
});

app.get('/groom-bride', function(req, res) {
	res.render("groom-bride.ejs");
});
