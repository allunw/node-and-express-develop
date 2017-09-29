var gulp = require('gulp')
var nodemon = require('gulp-nodemon')
var browserSync = require('browser-sync')
var reload = browserSync.reload

gulp.task("node", function() {
	nodemon({
		script: './server.js',
		env: {
			'NODE_ENV': 'development'
		}
	})
})

gulp.task('server', ["node"], function() {
	var files = [
		'views/**/*.html',
		'views/**/*.ejs',
		'views/**/*.jade',		
		'views/**/*.hbs',
		'views/**/*.*',
		'public/**/*.*',
		'./server.js'
	];

	browserSync.init(files, {
		proxy: 'http://localhost:3333',
		browser: 'chrome',
		notify: false,
		port: 3334
	});

	gulp.watch(files).on("change", function() {
		console.log('reload...')
		reload();
	})
})

gulp.task('default', function() {
	console.log('default task')
})
