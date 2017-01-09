const fs = require('fs');

const gulp = require('gulp');
const gutil = require('gulp-util');

const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();

const babel = require('gulp-babel');
const jsonMinify = require('gulp-json-minify')


// ################################################
// отчистка директории
// ################################################
gulp.task('build-clear', function() {
    //return this.src('build/*', { read: false })
    //	.pipe(plugins.clean());
});

// ################################################
// build
// ################################################
gulp.task('build', ['build-clear'], function() {

    // ################################################
    // manifest
    // ################################################
    gulp.src('src/manifest/manifest.json')
        .pipe(gulp.dest('build/'));


    // ################################################
    // копирование библиотек
    // ################################################
    gulp.src('src/libs/**/*.js')
        .pipe(gulp.dest('build/libs/'));


    // ################################################
    // icon for omnibox
    // ################################################
    gulp.src('src/omnibox/icon.png')
        .pipe(gulp.dest('build/'));


    // ################################################
    // background
    // ################################################
    gulp.src('src/background/*.html')
        .pipe(plugins.concat('background.html'))
        .pipe(gulp.dest('build/'));


    gulp.src([
            'src/background/*.js',

            // нужно включить в первую очередь
            'src/background/js/kit/Kit.js',
            'src/background/js/tab/Kit.js',
            'src/background/js/browserApi/browserApi.js',
            'src/background/js/browserApi/runtime/runtime.js',
            'src/background/js/browserApi/tabs/tabs.js',
            'src/background/js/browserApi/windows/windows.js',

            // потом все остальное по уровням вложенности
            'src/background/js/*.js',
            'src/background/js/*/*.js',
            'src/background/js/*/*/*.js'
        ])
        .pipe(plugins.concat('background.js'))
        //.pipe(babel({
        //	presets: ['es2015']
        //}))
        //.pipe(plugins.uglify())
        .pipe(gulp.dest('build/'));


    // ################################################
    // background setting json
    // ################################################
    gulp.src('src/background/setting.json')
        .pipe(plugins.concat('background_setting.json'))
        .pipe(jsonMinify())
        .pipe(gulp.dest('build/'))
        .on('error', gutil.log);

    // ################################################
    // popup
    // ################################################
    gulp.src('src/page_popup/index.html')
        .pipe(plugins.concat('popup.html'))
        .pipe(gulp.dest('build/'));

    gulp.src([
        'src/page_popup/popup.js',
        'src/page_popup/util.js',
        'src/page_popup/**/*.js'
    ])
        .pipe(plugins.concat('popup.js'))
        //.pipe(babel({
        //    presets: ['es2015']
        //}))
        //.pipe(plugins.uglify())
        .pipe(gulp.dest('build/'));

    gulp.src([
        'src/page_popup/**/*.css'
    ])
        .pipe(plugins.concat('popup.css'))
        .pipe(gulp.dest('build/'));


    // ################################################
    // options страница настроек
    // ################################################
    gulp.src('src/page_options/*.html')
        .pipe(plugins.concat('options.html'))
        .pipe(gulp.dest('build/'));

    gulp.src('src/page_options/css/*.css')
        .pipe(plugins.concat('options.css'))
        .pipe(gulp.dest('build/'));

    gulp.src('src/page_options/js/*.js')
        .pipe(plugins.concat('options.js'))
        .pipe(gulp.dest('build/'));


    // ################################################
    // blank пустая страница при открытии окна
    // ################################################
    gulp.src('src/page_blank/*.html')
        .pipe(plugins.concat('blank.html'))
        .pipe(gulp.dest('build/'));

    gulp.src('src/page_blank/css/*.css')
        .pipe(plugins.concat('blank.css'))
        .pipe(gulp.dest('build/'));

    gulp.src('src/page_blank/js/*.js')
        .pipe(plugins.concat('blank.js'))
        .pipe(gulp.dest('build/'));

});

// отслеживание изменений
gulp.task('serve', ['build'], function() {
    gulp.watch('src/**/*', ['build']);
});
