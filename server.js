var express = require('express');
var app = express();
var fortune = require('./lib/fortune.js');
var exphbs = require('express3-handlebars');
var formidable = require('formidable');
var credentials = require('./credentials.js');


var handlebars = exphbs.create({defaultLayout: 'main'});

//设置handlebars 视图引擎
app.engine('handlebars', handlebars.engine);
//app.engine('.hbs', exphbs({extname: '.hbs'}));
//app.set('view engine', '.hbs');
app.set('view engine', '.handlebars');
app.set('views', 'views/layouts/');
//app.set('views', 'views/partials/');

app.use(express.static(__dirname + '/public'));

app.use(require('body-parser')());

app.use(require('cookie-parser')(credentials.cookieSecret));
app.use(require('express-session')());

app.get('/', function(req, res) {
	if (!req.cookies.monster || !req.cookies.signed_monster) {
		res.cookie('monster', 'nom nom');
		res.cookie('signed_monster', 'nom nom', {signed: true});
	}
	res.render('home');
});

app.get('/about',function(req, res){
	res.render('about', { fortune: fortune.getFortune() });
});

app.get('/headers', function(req, res) {
	res.set('Content-Type', 'text/plain')	;
	var s = '';
	for(var name in req.headers) s += name + ': ' + req.headers[name] + '\n'
	res.send(s)
});

app.get('/thank-you', function(req, res) {
	res.render('thank-you')	;
})

app.get('/newsletter', function(req, res) {
	res.render('newsletter', {csrf: 'CSRF token goes here'});
})

app.post('/process', function(req, res) {
	console.log('Form (from querystring): ' + req.query.form);
	console.log('CSRF token (from hidden form field): ' + req.body._csrf);
	console.log('Name (from visible form field): ' + req.body.name);
	console.log('Email (from visible form field): ' + req.body.email);
	res.redirect(303, '/thank-you');
})

app.get('/contest/vacation-photo', function(req, res) {
	var now = new Date();
	res.render('contest/vacation-photo', {
		year: now.getFullYear(), month: now.getMonth()
	});
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
	/*var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if (err)	return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
		res.redirect(303, '/thank-you');
	});*/

	res.redirect(303, '/thank-you');
});

app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.set('port', process.env.PORT || 3333);

app.listen(app.get('port'), function() {
	console.log( 'Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});
