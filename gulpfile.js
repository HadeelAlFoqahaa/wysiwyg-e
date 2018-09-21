/* global require */
var gulp = require('gulp');
var bump = require('gulp-bump');
var git  = require('gulp-git');
var filter = require('gulp-filter');
var argv = require('yargs')
    .option('type', {
        alias: 't',
        choices: ['patch', 'minor', 'major']
    }).argv;
var tag = require('gulp-tag-version');
var push = require('gulp-git-push');

// Gettext
var gettext = require("gulp-gettext-polymer");
gulp.task('gettext-extract', function () {
    return gulp.src("./*html")
        .pipe(gettext.extract())
        .pipe(gulp.dest("./po"));
});

gulp.task('gettext-combine', function () {
    return gulp.src("./po/*po")
        .pipe(gettext.combine())
        .pipe(gulp.dest("./"));
});

gulp.task('bump', function() {
  return gulp.src(['./package.json', './bower.json'])
        // bump package.json and bowser.json version
        .pipe(bump({
            type: argv.type || 'patch'
        }))
        // save the bumped files into filesystem
        .pipe(gulp.dest('./'))
        // commit the changed files
        .pipe(git.commit('bump version'))
        // filter one file
        .pipe(filter('package.json'))
        // create tag based on the filtered file
        .pipe(tag())
        // push changes into repository
        .pipe(push({
            repository: 'origin',
            refspec: 'HEAD'
        }))
});
