require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');

var app = express();

app.get('/', function (req, res) {
  // app.use(bodyParser.urlencoded({ extended: true }));
  res.send('Hello World!');
  console.log(req.query.id);
});

app.get('/buy', function (req, res) {
	res.send('Sell page');
});

app.get('/login', function (req, res) {
	//res.send('login');
	res.redirect('https://climate.com/static/app-login/index.html?scope=openid+user&page=oidcauthn&mobile=true&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&client_id=dpcalv4fllsc3s');

	//redirect to climate login here
});//change

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});