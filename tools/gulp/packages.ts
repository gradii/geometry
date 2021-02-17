import {BuildPackage} from 'material2-build-tools';

export const cdkPackage = new BuildPackage('cdk');
export const materialPackage = new BuildPackage('material', [cdkPackage]);
export const youTubePlayerPackage = new BuildPackage('youtube-player');
export const googleMapsPackage = new BuildPackage('google-maps');
export const cdkExperimentalPackage = new BuildPackage('cdk-experimental', [cdkPackage]);
export const materialExperimentalPackage = new BuildPackage('material-experimental',
    [cdkPackage, cdkExperimentalPackage, materialPackage]);
export const momentAdapterPackage = new BuildPackage('material-moment-adapter', [materialPackage]);
export const examplesPackage = new BuildPackage('material-examples', [
  cdkPackage,
  cdkExperimentalPackage,
  materialPackage,
  materialExperimentalPackage,
  momentAdapterPackage,
  googleMapsPackage,
]);

// The material package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@angular/material`.
materialPackage.exportsSecondaryEntryPointsAtRoot = true;

// Some CDK & Material experimental secondary entry-points include SCSS files that should be exposed
// individually at the release output root. This is different in the Material package because here a
// full SCSS bundle will be generated.
cdkPackage.copySecondaryEntryPointStylesToRoot = true;
materialExperimentalPackage.copySecondaryEntryPointStylesToRoot = true;

// Build and copy the schematics of the CDK and Material package.
cdkPackage.hasSchematics = true;
materialPackage.hasSchematics = true;

/** List of all build packages defined for this project. */
export const allBuildPackages = [
  cdkPackage,
  materialPackage,
  youTubePlayerPackage,
  cdkExperimentalPackage,
  materialExperimentalPackage,
  momentAdapterPackage,
  googleMapsPackage,
  examplesPackage
];
