require('dotenv').load();
var express = require('express');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var request = require('superagent');
var app = express();

app.get('/', function (req, res) {
  // app.use(bodyParser.urlencoded({ extended: true }));
  res.send('Hello World!');

});
app.get('/post_login', function(req, res) {
  console.log(req.query.code);
  request
  .post('https://climate.com/api/oauth/token')
  .send({ grant_type: 'authorization_code', scope: 'openid user', redirect_uri : 'localhost:3000/get_token', code : req.query.code})
  .set('Authorization', 'Basic bmRtcWN2cGYyMzFpc2c3ODk3aHNyaGlwZzU=')
  .end(function(err, res){
    console.log(err);
    console.log(res);
  });
});
app.get('/get_token', function (req, res) {
	res.send('Sell page');
	console.log(res.body);
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