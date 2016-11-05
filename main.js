"use strict";

const express = require('express');
const bodyParser = require('body-parser'); // additional body parsing
const morgan = require('morgan'); // General request logger
const Cookies = require('cookies'); // General cookie handling
const path = require('path'); // path.join
const pp = s => path.join(__dirname, s);
const app = express();
const server = require('http').createServer(app); // or https
const config = require('./config');
const debug = require('./utils/debug'); // + my own logger
const sockets = require('./controllers/sockets');
sockets.attach(server); // attach() is Socket.IO specific

app.set('views', pp('views')); // where templates are located
app.set('view engine', 'pug'); // Express loads the module internally

app.use(Cookies.express());
app.use(bodyParser.urlencoded({ extended: false })); // application/x-www-form-urlencoded
app.use(bodyParser.json()); // application/json
app.use(morgan('dev')); // Set up logger
app.use(debug.requestInfo); // Middleware function - Order/Place of call important!

// Expose urls like /static/images/logo.png 
app.use('/static', express.static(pp('public'))); // first arg could be omitted

app.get('/', function(req, res) {
	// Standard cookies
	req.cookies.set("my-cookie-key", "my-cookie-string-value");
	req.cookies.get("my-cookie-key");

	// res.json({ user: 'john' }); // Send json response
	// res.sendFile( __dirname + "/" + "index.html" );
	// Now render .pug template with any JSON locals/variables:
	res.render('index', 
		{ title: 'Demo', data: { name: "Shop", items: [3, 5, 8] } } 
	); 
});

/** Socket.IO demo index page */
app.get('/sockets', function(req, res) {
	res.render('sockets'); 
});

/* Specify both GET and POST endpoint */
app.route('/debug') 
	.get((req, res) => res.jsonPretty(req.requestInfo)) // jsonPretty() is custom
	.post((req, res) => res.status(200).json(req.requestInfo));


server.listen(config.PORT, function() {
	let host = server.address().address;
	let port = server.address().port;
	let currentTime = new Date().toLocaleTimeString();
	// console.log(app.get('env'));
	console.log("Server dir: " + pp('/'));
	console.log(currentTime + " - Server running at http://localhost:" + port);
});


