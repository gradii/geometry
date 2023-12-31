/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

// Note that this file isn't being transpiled so we need to keep it in ES5. Also
// identifiers of the format "$NAME_TMPL" will be replaced by the Bazel rule that
// converts this template file into the actual SystemJS configuration file.

var TRIANGLE_PACKAGES = $TRIANGLE_ENTRYPOINTS_TMPL;
var TRIANGLE_ICONS_PACKAGES = $TRIANGLE_ICONS_ENTRYPOINTS_TMPL;
var CUBE_PACKAGES     = $CUBE_ENTRYPOINTS_TMPL;

/** Map of Angular framework packages and their bundle names. */
var frameworkPackages = $ANGULAR_PACKAGE_BUNDLES;

/** Whether Ivy is enabled. */
var isRunningWithIvy = '$ANGULAR_IVY_ENABLED_TMPL'.toString() === 'True';

/** Path that relatively resolves to the directory that contains all packages. */
var packagesPath = '$PACKAGES_DIR';

/** Path that relatively resolves to the node_modules directory. */
var nodeModulesPath = '$NODE_MODULES_BASE_PATH';

/** Path mappings that will be registered in SystemJS. */
var pathMapping = {
  'tslib'      : 'node:tslib/tslib.js',
  'moment'     : 'node:moment/min/moment-with-locales.min.js',
  'html2canvas': 'node:html2canvas/dist/html2canvas.js',
  'lodash'     : 'node:lodash/lodash.js',
  'ramda'      : 'node:ramda/dist/ramda.js',
  'uuid'       : 'node:uuid/dist/umd/uuid.min.js',
  'date-fns'   : 'date-fns_bundle.umd.js',

  'rxjs'          : 'node:rxjs/bundles/rxjs.umd.min.js',
  'rxjs/operators': 'tools/system-rxjs-operators.js',
};

/** Package configurations that will be used in SystemJS. */
var packagesConfig = {
  // Set the default extension for the root package. Needed for imports to source files
  // without explicit extension. This is common in CommonJS.
  '.': {defaultExtension: 'js'},
};

// Configure framework packages.
setupFrameworkPackages();

// Configure Angular components packages/entry-points.
setupLocalReleasePackages();

// Configure the base path and map the different node packages.
System.config({
  baseURL : '$BASE_URL',
  map     : pathMapping,
  packages: packagesConfig,
  paths   : {
    'node:*': nodeModulesPath + '*',
  }
});

/**
 * Walks through all interpolated Angular Framework packages and configures
 * them in SystemJS. Framework packages should always resolve to the UMD bundles.
 */
function setupFrameworkPackages() {
  Object.keys(frameworkPackages).forEach(function (moduleName) {
    var primaryEntryPointSegments = moduleName.split('-');
    // Ensures that imports to the framework package are resolved
    // to the configured node modules directory.
    pathMapping[moduleName] = 'node:' + moduleName;
    // Configure each bundle for the current package.
    frameworkPackages[moduleName].forEach(function (bundleName) {
      // Entry-point segments determined from the UMD bundle name. We split the
      // bundle into segments based on dashes. We omit the leading segments that
      // belong to the primary entry-point module name since we are only interested
      // in the segments that build up the secondary or tertiary entry-point name.
      var segments = bundleName.substring(0, bundleName.length - '.umd.js'.length)
        .split('-')
        .slice(primaryEntryPointSegments.length);
      // The entry-point name. For secondary entry-points we determine the name from
      // the UMD bundle names. e.g. "animations-browser" results in "@angular/animations/browser".
      var entryPointName = segments.length ? moduleName + '/' + segments.join('/') : moduleName;

      var bundlePath = 'bundles/' + bundleName.replace(/\s+/g, '-');
      // When running with Ivy, we need to load the ngcc processed UMD bundles.
      // These are stored in the `__ivy_ngcc_` folder that has been generated
      // since we run ngcc with `--create-ivy-entry-points`. Filter out the compiler
      // package because it won't be processed by ngcc.
      if (isRunningWithIvy &&
        entryPointName !== '@angular/compiler' &&
        entryPointName !== '@angular/cdk/coercion'
      ) {
        bundlePath = '__ivy_ngcc__/' + bundlePath;
      }

      if (
        entryPointName === '@angular/cdk/drag/drop' ||
        entryPointName === '@angular/cdk/text/field'
      ) {
        entryPointName = entryPointName
          .replace(/\//g, '-')
          .replace('@angular-cdk-', '@angular/cdk/');

        packagesConfig[entryPointName] = {
          main: '../' + bundlePath
        }
      } else {
        packagesConfig[entryPointName] = {
          main: segments
              .map(function () {
                return '../'
              })
              .join('') +
            bundlePath
        };
      }
    });
  });
}

/** Configures the local release packages in SystemJS */
function setupLocalReleasePackages() {
  // Configure all primary entry-points.
  configureEntryPoint('triangle');

  configureEntryPoint('triangle-icons');

  configureEntryPoint('check-type');

  configureEntryPoint('vector-math');

  // Configure all secondary entry-points.
  TRIANGLE_PACKAGES.forEach(function (pkgName) {
    configureEntryPoint('triangle', pkgName);
  });

  TRIANGLE_ICONS_PACKAGES.forEach(function (pkgName) {
    configureEntryPoint('triangle-icons', pkgName);
  });

  CUBE_PACKAGES.forEach(function (pkgName) {
    configureEntryPoint('cube', pkgName);
  });

  // Private secondary entry-points.
  // configureEntryPoint('components-examples', 'private');
}

/** Configures the specified package, its entry-point and its examples. */
function configureEntryPoint(pkgName, entryPoint) {
  var name         = entryPoint ? pkgName + '/' + entryPoint : pkgName;
  var examplesName = 'components-examples/' + name;

  pathMapping['@gradii/' + name]         = packagesPath + '/' + name;
  pathMapping['@gradii/' + examplesName] = packagesPath + '/' + examplesName;

  // Ensure that imports which resolve to the entry-point directory are
  // redirected to the "index.js" file of the directory.
  packagesConfig[packagesPath + '/' + name] =
    packagesConfig[packagesPath + '/' + examplesName] = {main: 'index.js'};
}
