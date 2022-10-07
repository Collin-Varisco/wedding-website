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
		try {
			var registrySelectSQL = "SELECT * FROM GiftInfo WHERE GiftID NOT IN (SELECT PurchasedGift FROM GiftGivers)";
			db.all(registrySelectSQL, function (err, data, fields) {
				if(err) { throw err }
				else {
					res.render("registry.ejs", {title: 'Registry', registryData: data} );
				}
			});
		} catch (e) {
			console.log(e);
		}
});




app.get('/confirm', function(req,res){
	try {
		var confirmSQL = "SELECT * FROM PurchaseInfo, GiftInfo WHERE GID=" + req.query.id + " AND GiftID=" + req.query.id;
		db.all(confirmSQL, function(err, data){
			if(err)
			{ 
			    console.log(err);
			}
			else 
			{
			    res.render('confirm.ejs', {title: 'Confirmation', purchaseData: data});
			}
		});
	} catch (e) {
		console.log(e);
	}
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
	try {
		// check if the gift is already purchased
		var checkSQL = "SELECT COUNT(*) FROM GiftGivers WHERE PurchasedGift=" + req.body.giftID;
		db.all(checkSQL, function(err, data){
			if(err){ console.log(err); }
			else {
				if(data[0]['COUNT(*)'] == 1) {
					res.send("Gift already purchased");
				} else {
					// Insert Name of gift giver and what item they are gifting to the GiftGivers table.
					const insertGiftGiver = db.prepare("INSERT INTO GiftGivers (GiftGiverName, PurchasedGift) VALUES(?, ?)");
					insertGiftGiver.run(req.body.PersonName, req.body.giftID);
					insertGiftGiver.finalize();
					res.send('<head><link rel="stylesheet" href="css/style.css"></head><body><h1>Thank you!</h1></body>');
				}
			}
		});
	} catch (e) { console.log(e); }
});

// SQL Statement for returning the Name of the Gift and who purchased it.
// SELECT GiftGiverName, GiftName FROM GiftInfo, GiftGivers WHERE PurchasedGift = GiftID;
