const fs = require('fs');

const gulp = require('gulp');
const gutil = require('gulp-util');

const loadPlugins = require('gulp-load-plugins');
const plugins = loadPlugins();

const babel = require('gulp-babel');
const jsonMinify = require('gulp-json-minify')


// отчистка директории
gulp.task('build-clear', function() {
    //return this.src('build/*', { read: false })
    //	.pipe(plugins.clean());
});

// ##### build
gulp.task('build', ['build-clear'], function() {

    // manifest
    gulp.src('src/manifest/manifest.json')
        .pipe(gulp.dest('build/'));

    // js background
    gulp.src([
            'src/background/*.js',

            // нужно включить в первую очередь
            'src/background/js/kit/Item.js',
            'src/background/js/tab/Item.js',
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

    // background setting.json
    // todo изменить название файла источника и переименование сделать при минификации
    gulp.src('src/background/background_setting.json')
        .pipe(jsonMinify())
        .pipe(gulp.dest('build/'))
        .on('error', gutil.log)

    // popup html
    gulp.src('src/popup/popup.html')
        .pipe(gulp.dest('build/'));

    // popup js
    gulp.src([

            'src/libs/Message.js',
            'src/popup/js/*.js'

        ])
        .pipe(plugins.concat('popup.min.js'))
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('build/'));

    // popup css
    gulp.src('src/popup/css/*.css')
        .pipe(plugins.concat('popup.min.css'))
        .pipe(gulp.dest('build/'));

    // discard page html
    //gulp.src('src/page_discard/discarded.html')
    //    .pipe(gulp.dest('build/'));

    // просто копируем
    // blank пустая страница при открытии окна
    gulp.src('src/blank/*.*')
        .pipe(gulp.dest('build/'));

    // icon for omnibox
    //gulp.src('src/omnibox/icon.png')
    //	.pipe(gulp.dest('build/'));

});

// отслеживание изменений
gulp.task('serve', ['build'], function() {
    gulp.watch('src/**/*', ['build']);
});

// console.log (i);
