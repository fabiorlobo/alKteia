/* * * * * * * * * * * * * *
	REQUIRES
* * * * * * * * * * * * * */

// Gulp
gulp = require('gulp'),
rename = require('gulp-rename'),
plumber = require('gulp-plumber'),

// Sass
sass = require('gulp-sass'),

// Scripts
uglify = require('gulp-uglify'),

// HTML
htmlmin = require('gulp-htmlmin'),

// Image Optimization
imagemin = require('gulp-imagemin')

// Open
open = require('gulp-open'),

// Browser Sync
browserSync = require('browser-sync'),

// Others
del = require('del');

/* * * * * * * * * * * * * *
	SASS
* * * * * * * * * * * * * */

sass.compiler = require('node-sass');

function styles() {
	return gulp.src('./dev_files/styles/**/*.scss')
	.pipe(plumber(function (error) {
		console.log(error.message);
		this.emit('end');
	}))
	.pipe(sass({
		outputStyle: 'compressed'
	}))
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('./assets/styles'));
};

exports.styles = styles;

/* * * * * * * * * * * * * *
	SCRIPTS
* * * * * * * * * * * * * */

function scripts() {
	return gulp.src('./dev_files/scripts/**/*.js')
	.pipe(plumber())
	.pipe(uglify())
	.pipe(rename({
		suffix: '.min'
	}))
	.pipe(gulp.dest('./assets/scripts'));
};

exports.scripts = scripts;

/* * * * * * * * * * * * * *
HTML
* * * * * * * * * * * * * */

function htmls() {
	return gulp.src('./dev_files/html/**/*.html')
	.pipe(plumber())
	.pipe(htmlmin({
		collapseWhitespace: true,
		minifyCSS: true,
		minifyJS: true,
		removeComments: true
	}))
	.pipe(gulp.dest('./'));
};

exports.htmls = htmls;

/* * * * * * * * * * * * * *
	IMAGE OPTIMIZATION
* * * * * * * * * * * * * */

function delImagesFolder() {
	return del('./assets/images/**/*');
}

exports.delImagesFolder = delImagesFolder;

// GIF

function gif() {
	return gulp.src('./dev_files/images/**/*.gif')
	.pipe(imagemin([
		imagemin.gifsicle()
	],
	{
		verbose: true
	}))
	.pipe(gulp.dest('./assets/images'));
};

exports.gif = gif;

// JPG

function jpg() {
	return gulp.src('./dev_files/images/**/*.{jpg,jpeg}')
	.pipe(imagemin([
		imagemin.mozjpeg()
	],
	{
		verbose: true
	}))
	.pipe(gulp.dest('./assets/images'));
};

exports.jpg = jpg;

// PNG

function png() {
	return gulp.src('./dev_files/images/**/*.png')
	.pipe(imagemin([
		imagemin.optipng()
	],
	{
		verbose: true
	}))
	.pipe(gulp.dest('./assets/images'));
};

exports.png = png;

// SVG

function svg() {
	return gulp.src('./dev_files/images/**/*.svg')
	.pipe(imagemin([
		imagemin.svgo({
			plugins: [
				{
					removeTitle: false
				},
				{
					removeDesc: false
				},
				{
					removeViewBox: false
				},
				{
					mergePaths: false
				},
				{
					cleanupIDs: true
				},
				{
					removeUnknownsAndDefaults: {
						keepDataAttrs: false
					}
				}
			]
		})
	], {
		verbose: true
	}))
	.pipe(gulp.dest('./assets/images'));
};

exports.svg = svg;

// All images

var images = gulp.series(gif, jpg, png, svg);

exports.images = images;

/* * * * * * * * * * * * * *
	WATCH

	Watch for SASS, JS and HTML
* * * * * * * * * * * * * */

function watch() {
	gulp.watch('./dev_files/styles/**/*', styles);
	gulp.watch('./dev_files/scripts/**/*', scripts);
	gulp.watch('./dev_files/**/*.html', htmls);
}

exports.watch = watch;

/* * * * * * * * * * * * * *
	BROWSER SYNC

	Uses browser-sync and watch
* * * * * * * * * * * * * */

function browsersync() {
	browserSync.init({
		files: './**/*',
		proxy: 'alkteia.localhost',
		open: false
	});
}

var sync = gulp.parallel(browsersync, gulp.parallel(watch));

exports.sync = sync;