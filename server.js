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


let db = new sqlite3.Database('./db/registry.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Connected to the in-memory SQlite database.');
});

// Home Page
app.get('/', function(req, res) {
	res.render("index.ejs");
});


app.get('/registry', function(req, res) {
		var registrySelectSQL = "SELECT * FROM GiftInfo WHERE GiftID NOT IN (SELECT PurchasedGift FROM GiftGivers)";
		db.all(registrySelectSQL, function (err, data, fields) {
			if(err) { throw err }
			else {
				res.render("registry.ejs", {title: 'Registry', registryData: data} );
			}
		});
});




app.get('/confirm', function(req,res){
	var confirmSQL = "SELECT * FROM PurchaseInfo, GiftInfo WHERE GID=" + req.query.id + " AND GiftID=" + req.query.id;
	db.all(confirmSQL, function(err, data){
		if(err){ throw err }
		else {
			res.render('confirm.ejs', {title: 'Confirmation', purchaseData: data});
		}
	});
});

app.get('/index', function(req, res) {
	res.render("index.ejs");
});


app.get('/when-where', function(req, res) {
	res.render("when-where.ejs");
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

// Post Method
app.post('/confirmPurchase', function(req,res){
	// Insert Name of gift giver and what item they are gifting to the GiftGivers table.
	const insertGiftGiver = db.prepare("INSERT INTO GiftGivers (GiftGiverName, PurchasedGift) VALUES(?, ?)");
	insertGiftGiver.run(req.body.PersonName, req.body.giftID);
	insertGiftGiver.finalize();

	// Load Registry Page With Updated Items
	var registrySelectSQL = "SELECT * FROM GiftInfo WHERE GiftID NOT IN (SELECT PurchasedGift FROM GiftGivers)";
	db.all(registrySelectSQL, function (err, data, fields) {
		if(err) { throw err }
		else {	res.render("registry.ejs", {title: 'Registry', registryData: data} ); }
	});
});

// SQL Statement for returning the Name of the Gift and who purchased it.
// SELECT GiftGiverName, GiftName FROM GiftInfo, GiftGivers WHERE PurchasedGift = GiftID;