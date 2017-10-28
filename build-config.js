/**
 * Build configuration for the packaging tool. This file will be automatically detected and used
 * to build the different packages inside of Material.
 */
const {join} = require('path');

const package = require('./package.json');

/** Current version of the project*/
const buildVersion = package.version;

/** Required Angular version for the project. */
const angularVersion = package.dependencies['@angular/core'];

/** License that will be placed inside of all created bundles. */
const buildLicense = `/**
 * @Author LinboLen@gradee.org
 */`;

module.exports = {
  projectVersion: buildVersion,
  angularVersion: angularVersion,
  projectDir: __dirname,
  packagesDir: join(__dirname, 'libs'),
  outputDir: join(__dirname, 'dist'),
  licenseBanner: buildLicense
};
