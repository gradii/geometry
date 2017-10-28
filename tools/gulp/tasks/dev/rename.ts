import { dest, src, task } from 'gulp';


const rename = require("gulp-rename");
const replace = require("gulp-replace");

task('rename-public_api', function () {
  src('./**/public_api.ts', {base: './'})
    .pipe(rename({
      basename: 'public-api',
      extname : ".ts"
    }))
    .pipe(dest("./dist-tmp"));
});

//
// task('tsconfig-build.json', () => {
//   src('./**/public_api.ts', {base: './'})
//     .pipe()
// });
//
task('rename-examples', () => {
  src('./examples/**/*', {base: './'})
    .pipe(rename((_path: any) => {
      _path.dirname = _path.dirname.replace(/nz-/i, 'tri-');
      _path.basename = _path.basename.replace(/nz-/i, 'tri-');
    }))
    .pipe(replace(/nz([A-Z])/g, (match: string, p1: string, offset: number, string: string) => {
      return `${p1.toLowerCase()}`;
    }))
    .pipe(dest('./dist-tmp'));
});
