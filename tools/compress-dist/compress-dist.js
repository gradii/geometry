const tar = require('tar');
const format = require('date-fns/format');
const fs = require('fs');
const path = require('path');

const dateString = format(new Date, 'yyyyMMdd_HHmmss')

const fileMap = [
  {
    key: 'devops',
    cwd: './dist/apps/devops/prod',
    source: ['./'],
    output: `dist/build-tar/devops_prod_${dateString}.tgz`
  },
];

const buildTarDir = 'dist/build-tar';

if (!fs.existsSync(buildTarDir)) {
  fs.mkdirSync(buildTarDir);
}

fs.readdir(buildTarDir, (err, files) => {
  if (err) throw err;

  for (const file of files) {
    fs.unlink(path.join(buildTarDir, file), err => {
      if (err) throw err;
    });
  }
});


//build devops
for (const val of fileMap) {
  tar.c(
    {
      gzip: true,
      file: val.output,
      prefix: val.key,
      cwd: val.cwd,
      // uname: 'AdsRcm',
      // gname: 'AdsRcm'
    }, val.source
  ).then(_ => {
    console.log(`${val.key} .. tarball has been created ..`);
  });
}
