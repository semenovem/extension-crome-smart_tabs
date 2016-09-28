var gulp = require('gulp'),
	loadPlugins = require('gulp-load-plugins'),
	plugins = loadPlugins(),
	fs = require('fs');

var babel = require('gulp-babel');

// отчистка директории
gulp.task('build-clear', function() {
	//return this.src('build/*', { read: false })
	//	.pipe(plugins.clean());
});

// ##### build
gulp.task('build', ['build-clear'], function() {

	// manifest
	//gulp.src('src/manifest/manifest.json')
	//	.pipe(gulp.dest('build/'));

	// js background
	gulp.src([
			'src/background/*.js',
            // данные kit
            'src/background/js/kit/Item.js',
            'src/background/js/kit/itemPrototype.js',
            'src/background/js/kit/collect.js',
            'src/background/js/kit/conv.js',
            // tab
            'src/background/js/tab/Item.js',
            'src/background/js/tab/itemPrototype.js',
            'src/background/js/tab/collect.js',
            'src/background/js/tab/conv.js',


            'src/background/js/controller/*.js',
            'src/background/js/store/*.js',
            'src/background/js/api/*.js',
            'src/background/js/classes/*.js',
			'src/background/js/*.js'

		])
		.pipe(plugins.concat('background.js'))
            // для chrome 52 не нужен
		//.pipe(babel({
		//	presets: ['es2015']
		//}))
		//.pipe(plugins.uglify())
		.pipe(gulp.dest('build/'));

	// popup html
	gulp.src('src/popup/popup.html')
		.pipe(gulp.dest('build/'));

	// popup js
	gulp.src('src/popup/js/*.js')
		.pipe(plugins.concat('popup.min.js'))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(plugins.uglify())
		.pipe(gulp.dest('build/'));

	// popup css
	//gulp.src('src/popup/css/*.css')
	//	.pipe(plugins.concat('popup.min.css'))
	//	.pipe(gulp.dest('build/'));

	// icon for omnibox
	//gulp.src('src/omnibox/icon.png')
	//	.pipe(gulp.dest('build/'));

});

// отслеживание изменений
gulp.task('serve', ['build'], function() {
	gulp.watch('src/**/*', ['build']);
});

// console.log (i);
