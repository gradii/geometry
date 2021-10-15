#!/usr/bin/env node


/**
 * Script that builds the dev-app as a static web package that will be
 * deployed to the currently configured Firebase project.
 */

const {exec, set, cd, cp, rm, chmod} = require('shelljs');
const {join}                         = require('path');
const fs                             = require('fs');
const fse                            = require('fs-extra');
const tar                            = require('tar');
const {createHash}                   = require('crypto');

// ShellJS should throw if any command fails.
set('-e');

/** Path to the project directory. */
const projectDirPath = join(__dirname, '../');

// Go to project directory.
cd(projectDirPath);

//build devops
async function build() {
  const yarnLockContent = fs.readFileSync('yarn.lock');
  const yarnLockHash    = createHash('sha1').update(yarnLockContent).digest('hex');

  const buildTarDir = 'dist/node-modules-tar';

  const fileMap = [
    {
      key   : 'fedaco-node-modules',
      cwd   : './',
      source: ['node_modules'],
      output: `${buildTarDir}/{key}_${yarnLockHash}.tgz`
    },
  ];

  fse.ensureDirSync(buildTarDir);

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
}

try {
  build().then();
} catch (e) {
  throw e
}
