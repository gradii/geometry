import { task, src, dest, watch } from 'gulp';

const colorEasing = require('./bezier-easing').colorEasing;
const color = require('./less-color').colorpannel;
const mocha    = require('gulp-mocha');
const sass     = require('gulp-sass');
const less     = require('gulp-less');
const sassLint = require('gulp-sass-lint');

task('test-scss', () => {
    src('tests/**/*.js', { read: false })
    // `gulp-mocha` needs filepaths so you can't have any plugins before it
        .pipe(mocha({ reporter: 'spec' }))
});

task('lint-scss', () => {
    src('scss/**/bezierEasing.s+(a|c)ss')
        .pipe(sassLint())
        .pipe(sassLint.format())
        .pipe(sassLint.failOnError())
});

task('easing-js', () => {
    // let data = colorEasing(0.6);

    // let data = colorEasing(0.1);
    // console.log(data);

    console.log(color('#108ee9', 7));

    // lowerSlop(0.1);
});

task('compile-scss', /*[ 'easing-js' ], */() => {
    // return src('./tests/test-color.scss')
    return src('./scss/index.scss')
        .pipe(sass({
            // precision: 8
        }).on('error', sass.logError))
        .pipe(dest('./dist/scss'));
});

task('compile-less', () => {
    return src('./less/index.less')
        .pipe(less())
        .pipe(dest('./dist/less/'))
});

task('scss:watch', function () {
    watch('./scss/index.scss', [ 'compile-scss' ]);
});