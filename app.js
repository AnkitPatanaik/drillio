require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var request = require('superagent');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var app = express();
app.use(cookieParser());
app.use(flash());

app.get('/', function (req, res) {
  // app.use(bodyParser.urlencoded({ extended: true }));
  res.send('Here is our amazing frontpage. Please login');

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
		console.log(requestres);
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
		console.log(header);
		request
		.get('https://hackillinois.climate.com/api/fields?includeBoundary=false')
		.set('Accept', 'application/json')
		.set('Authorization', header)
		.end(function(err, requestres){
			console.log(requestres.body['fields']);
			var fields = requestres.body['fields'];
			fields.forEach(function(entry) {
			    console.log(entry['centroid']);
			});
		});
		
		res.send('Home page after authorization');
	}
});
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