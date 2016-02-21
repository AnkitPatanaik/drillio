require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var request = require('superagent');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var mysql      = require('mysql');
var path = require("path");
var app = express();

app.use(cookieParser());
app.use(flash());
app.set('views', 'src/views');
app.engine('handlebars', exphbs({
  layoutsDir: 'src/views/layouts/',
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');
app.use('/assets',  express.static(__dirname + '/src/assets'));
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'apps',
});
connection.connect();

app.get('/', function (req, res) {
	var status = 0;
	if (req.cookies.token !== undefined) {
		status = 1;
	}
	res.render('splash', {
		title: 'Welcome',
		status: status,
	});
});
app.get('/add/:id', function (req, res) {
	// app.use(bodyParser.urlencoded({ extended: true }));
	console.log(req.params.id);
	connection.query('SELECT * from `fields` WHERE uuid=?', [req.params.id], function (error, results, fields) {
		if(results.length == 0) {
			connection.query('INSERT INTO `fields` (uuid, email) VALUES (?,?)', [req.params.id, req.cookies.email], function (error, results, fields) {
	  		// console.log(error);
	  		res.sendStatus(200);
			});
		}
		else {
			res.sendStatus(400);
		}
	});
	
});
app.get('/like/:id/:status', function (req, res) {
	// app.use(bodyParser.urlencoded({ extended: true }));
	console.log(req.params.id);
	var status = 0;
	if(req.params.status == 1) {
		status = 1;
	}
	connection.query('SELECT * from `likes` WHERE uuid=? AND email=?', [req.params.id, req.cookies.email], function (error, results, fields) {
		if(results.length == 0) {
			connection.query('INSERT INTO `likes` (uuid, email, status) VALUES (?,?,?)', [req.params.id, req.cookies.email, status], function (error, results, fields) {
	  		// console.log(error);
	  		res.sendStatus(200);
			});
		}
		else {
			connection.query('UPDATE `likes` SET status = ? WHERE uuid = ? AND email = ?', [status, req.params.id, req.cookies.email], function (error, results, fields) {
	  		// console.log(error);
	  		res.sendStatus(200);
			});
		}
	});
	
});

app.get('/post_login', function(req, res) {
	request
	.post('https://climate.com/api/oauth/token')
	.type('form')
	.send({grant_type: 'authorization_code'})
	.send({scope: 'openid user'})
	.send({redirect_uri: 'http://localhost:3000/post_login'})
	.send({code: req.query.code})
	.set('Authorization', 'Basic ZHBjYWx2NGZsbHNjM3M6bmRtcWN2cGYyMzFpc2c3ODk3aHNyaGlwZzU=')
	.end(function(err, requestres){
		// store token and info
		var access_token = requestres.body['access_token'];
		var name = requestres.body['user']['firstname'] + " " + requestres.body['user']['lastname'];
		var email = requestres.body['user']['email'];

		res.cookie('token',access_token, { maxAge: requestres.body['expires_in'], httpOnly: true });
		res.cookie('name',name, { maxAge: requestres.body['expires_in'], httpOnly: true });
		res.cookie('email',email, { maxAge: requestres.body['expires_in'], httpOnly: true });
	  	res.redirect('/home');
	});
});
app.get('/home', function (req, res) {
	if (req.cookies.token === undefined) {
		res.send("not authed!");
	}
	else {
		var header = "Bearer " + req.cookies.token;
		var map = [];
		var firstmap;
		var i = 0;
		request
		.get('https://hackillinois.climate.com/api/fields?includeBoundary=false')
		.set('Accept', 'application/json')
		.set('Authorization', header)
		.end(function(err, requestres){
			// console.log(requestres.body['fields']);
			var fields = requestres.body['fields'];
			fields.forEach(function(entry) {
			 	// map.push("https://maps.googleapis.com/maps/api/staticmap?center=" + entry['centroid']['coordinates'][1] + "," +   entry['centroid']['coordinates'][0] +"&zoom=12&size=300x300&key=AIzaSyAdaFzQqYK2DwqEtxHdcUGU_raymUebynA");
			 	
			 	if(!i) {
			 		firstmap = entry;
			 		i = 1;
			 	}
			 	else {
			 		map.push(entry);
			 	}
			});
			// console.log(firstmap);
			res.render('home', {
	        	title: 'Fields',
	        	map: map,
	        	firstmap: firstmap,
      		});
		});
	}
});

//have a link to add stuff on home page
app.get('/add', function (req, res) {
	if (req.cookies.token === undefined) {
		res.send("not authed!");
	}
	else {
		res.redirect('https://climate.com/static/mfs/index.html');
	}
})


app.get('/buy', function (req, res) {
	res.send('Sell page');
});

app.get('/login', function (req, res) {
	//res.send('login');
	res.redirect('https://climate.com/static/app-login/index.html?scope=openid+user&page=oidcauthn&mobile=true&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fpost_login&client_id=dpcalv4fllsc3s');

	//redirect to climate login here
});//change

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});