#!/usr/bin/env node

/**
 * Script that builds the dev-app as a static web package that will be
 * deployed to the currently configured Firebase project.
 */

const {exec, set, cd, cp, rm, chmod} = require('shelljs');
const {join}                         = require('path');
const glob                           = require("globby");
const fs                             = require('fs');
const fse                            = require('fs-extra');
const format                         = require('date-fns/format');
const tar                            = require('tar');
const path                           = require('path');
const prettier                       = require('prettier')
const buildConfig                    = require('../build-config');

// ShellJS should throw if any command fails.
set('-e');

/** Path to the project directory. */
const projectDirPath = join(__dirname, '../');

// Go to project directory.
cd(projectDirPath);

/** Destination path where the web package should be copied to. */
const distPath = join(projectDirPath, 'dist/libs/triangle');

// Build web package output.
exec('yarn -s nx build triangle --prod');

//build devops
async function build() {
  const pkg     = fs.readFileSync(`${distPath}/package.json`, 'utf8');
  const pkgJson = JSON.parse(pkg);
  ['peerDependencies', 'dependencies', 'devDependencies'].forEach(dep => {
    if (pkgJson[dep]) {
      Object.keys(pkgJson[dep]).forEach(it => {
        if (it.startsWith('@angular')) {
          delete pkgJson[dep][it];
        }
      })
    }
  });

  fs.writeFileSync(`${distPath}/package.json`, JSON.stringify(pkgJson, null, 2));

  let files = glob.sync([`${distPath}/**/*.d.ts`, `${distPath}/**/*.js`], {nodir: true});
  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8')
        .replace(/^\/\/# sourceMappingURL=.+?$/mg, '')
        // .replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1')

      const licenseBanner = buildConfig.fedacoLicenseBanner;
      // const isJs = file.endsWith('.js');
      // content = prettier.format(content, {
      //   parser       : isJs ? 'espree' : 'typescript',
      //   trailingComma: isJs ? "es5" : "none",
      //   tabWidth     : isJs ? 2 : 4,
      //   semi         : isJs ? false : true,
      //   singleQuote  : true,
      // });

      fs.writeFileSync(file, `${licenseBanner}
${content}`, {encoding: 'utf8', mode: 10644});
    } catch (e) {
      console.error(e);
    }
  })

  files = glob.sync(`${distPath}/**/*.map`, {nodir: true})

  files.forEach(file => {
    fs.unlinkSync(file);
  })


  const dateString = format(new Date, 'yyyyMMdd_HHmmss')


  const fileMap = [
    {
      key   : 'triangle-npm-pkg',
      cwd   : distPath,
      source: ['./'],
      output: `dist/build-tar/{key}_${dateString}.tgz`
    },
  ];

  const buildTarDir = 'dist/build-tar';

  if (!fs.existsSync(buildTarDir)) {
    fs.mkdirSync(buildTarDir);
  }

  fse.emptyDirSync(buildTarDir);


  for (const val of fileMap) {
    await tar.c(
      {
        gzip  : true,
        file  : val.output.replace('{key}', val.key),
        prefix: val.key,
        cwd   : val.cwd,
      }, val.source
    )

    console.log(`${val.key} .. tarball has been created ..`);
  }


  exec(`yarn publish --registry=https://npm.pkg.github.com/ ${distPath}`);
}

try {
  build().then();
} catch (e) {
  throw e
}
