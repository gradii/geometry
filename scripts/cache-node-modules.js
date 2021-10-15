#!/usr/bin/env node


/**
 * Script that builds the dev-app as a static web package that will be
 * deployed to the currently configured Firebase project.
 */

const {join}       = require('path');
const fs           = require('fs');
const fse          = require('fs-extra');
const tar          = require('tar');
const {execSync}   = require("child_process");
const {createHash} = require('crypto');

/** Path to the project directory. */
const projectDirPath = join(__dirname, '../');

// Go to project directory.
process.chdir(projectDirPath);

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

  fse.emptyDirSync(buildTarDir);

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
    file: outputTgz,
    strip: 1,
  })
}

function checkCacheExist() {
  return fse.existsSync(outputTgz)
}

function runYarnInstall() {
  execSync(`yarn install`, {stdio: 'inherit'});
}

try {
  if(fse.existsSync('node_modules/@angular/core')) {
    console.log('node_modules exist. exit...')
    return;
  }
  if (checkCacheExist()) {
    console.log('found cached node_modules. extract...')
    extractCache().then();
  } else {
    console.log('cache not exist. build first...')
    runYarnInstall();
    console.log('compress node_modules...')
    buildCache().then();
  }

} catch (e) {
  throw e
}
