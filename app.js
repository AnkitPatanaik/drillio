var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/buy', function (req, res) {
	res.send('Sell page');
});

app.get('/login', function (req, res) {
	//res.send('login');
	res.redirect('https://climate.com/static/app-login/index.html?scope=openid+user&page=oidcauthn&mobile=true&response_type=code&redirect_uri=localhost:3000/&client_id=dpcalv4fllsc3s');

	//redirect to climate login here
});//change

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});