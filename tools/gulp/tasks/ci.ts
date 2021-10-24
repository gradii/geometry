import {series, task} from 'gulp';

task('ci:test', series('test:single-run'));
