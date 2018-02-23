const fs = require('fs');
const sh = require('shelljs');

const PATCH_LOCK = 'node_modules/@angular/cli/models/webpack-configs/.patched-webpack-enable-sourcemap';

//can generate patch file by `git diff` or use `diff -Nur`
if (!fs.existsSync(PATCH_LOCK)) {
  sh.exec('patch -p0 -i tools/cli-patches/webpack-enable-sourcemap.patch');
  sh.touch(PATCH_LOCK);
}

