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

const yarnLockContent = fs.readFileSync('yarn.lock');
const yarnLockHash    = createHash('sha1').update(yarnLockContent).digest('hex');
const buildTarDir     = `${process.env.HOME}/.cache/node-modules-tar`;
const outputTgz       = `${buildTarDir}/triangle_${yarnLockHash}.tgz`

console.log(`outputTgz: ${outputTgz}`)

//build devops
async function buildCache() {

  const fileMap = [
    {
      key   : 'triangle-node-modules',
      cwd   : './',
      source: ['node_modules'],
      output: outputTgz
    },
  ];

  fse.ensureDirSync(buildTarDir);

  for (const val of fileMap) {
    await tar.c(
      {
        gzip  : true,
        file  : val.output,
        prefix: val.key,
        cwd   : val.cwd,
      }, val.source
    )

    console.log(`${val.key} .. tarball has been created ..`);
  }
}

async function extractCache() {
  await tar.extract({
    file: outputTgz
  })
}

function checkCacheExist() {
  return fse.existsSync(outputTgz);
}

function runYarnInstall() {
  exec(`yarn install`).stdout.trim();
}

try {
  if (checkCacheExist()) {
    console.log('found cached node_modules. extract...')
    extractCache().then();
  } else {
    console.log('cache not exist. build first...')
    runYarnInstall();
    buildCache().then();
  }

} catch (e) {
  throw e
}
