var express = require('express')

var app = express();

app.set('port', process.env.PORT || 3333);

var handlebars = require('express3-handlebars')
	.create({defaultLayout: 'main'});

//设置handlebars 视图引擎
app.engine('handlebars', handlebars.engine);
app.set('view engie', 'handleBars');

app.get('/', function(req, res) {
	res.render('home');
})

app.get('/about',function(req, res){
	res.render('about');
})

app.use(function(req, res){
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log( 'Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});