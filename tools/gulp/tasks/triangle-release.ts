import { task, src, dest } from 'gulp';
import { join } from 'path';
import { writeFileSync, mkdirpSync } from 'fs-extra';
import { Bundler } from 'scss-bundle';
import { composeRelease, buildConfig, sequenceTask } from 'material2-build-tools';
import { trianglePackage } from '../packages';

// There are no type definitions available for these imports.
const gulpRename = require('gulp-rename');

const distDir = buildConfig.outputDir;
const {sourceDir, outputDir} = trianglePackage;

/** Path to the directory where all releases are created. */
const releasesDir = join(distDir, 'releases');

// Path to the release output of material.
const releasePath = join(releasesDir, 'material');
// The entry-point for the scss theming bundle.
const themingEntryPointPath = join(sourceDir, 'core', 'theming', '_all-theme.scss');
// Output path for the scss theming bundle.
const themingBundlePath = join(releasePath, '_theming.scss');
// Matches all pre-built theme css files
const prebuiltThemeGlob = join(outputDir, '**/theming/prebuilt/*.css?(.map)');
// Matches all SCSS files in the different packages.
const allScssGlob = join(buildConfig.packagesDir, '**/*.scss');

/**
 * Overwrite the release task for the material package. The material release will include special
 * files, like a bundled theming SCSS file or all prebuilt themes.
 */
task('triangle:build-release', ['triangle:prepare-release'], () => composeRelease(trianglePackage));

/**
 * Task that will build the material package. It will also copy all prebuilt themes and build
 * a bundled SCSS file for theming
 */
task('triangle:prepare-release', sequenceTask(
  'triangle:build',
  ['triangle:copy-prebuilt-themes', 'triangle:bundle-theming-scss']
));

/** Copies all prebuilt themes into the release package under `prebuilt-themes/` */
task('triangle:copy-prebuilt-themes', () => {
  src(prebuiltThemeGlob)
    .pipe(gulpRename({dirname: ''}))
    .pipe(dest(join(releasePath, 'prebuilt-themes')));
});

/** Bundles all scss requires for theming into a single scss file in the root of the package. */
task('triangle:bundle-theming-scss', () => {
  // Instantiates the SCSS bundler and bundles all imports of the specified entry point SCSS file.
  // A glob of all SCSS files in the library will be passed to the bundler. The bundler takes an
  // array of globs, which will match SCSS files that will be only included once in the bundle.
  return new Bundler().Bundle(themingEntryPointPath, [allScssGlob]).then(result => {
    // The release directory is not created yet because the composing of the release happens when
    // this task finishes.
    mkdirpSync(releasePath);
    writeFileSync(themingBundlePath, result.bundledContent);
  });
});
