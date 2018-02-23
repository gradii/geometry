import { BuildPackage, buildConfig } from 'material2-build-tools';
import { join } from 'path';

export const trianglePackage = new BuildPackage('triangle');

// The material package re-exports its secondary entry-points at the root so that all of the
// components can still be imported through `@angular/material`.
trianglePackage.exportsSecondaryEntryPointsAtRoot = false;

// To avoid refactoring of the project the material package will map to the source path `lib/`.
// trianglePackage.sourceDir = join(buildConfig.packagesDir, 'triangle');

// Some CDK secondary entry-points include SCSS files that should be exposed individually at the
// release output root. This is different in the Material package because here a full SCSS bundle
// will be generated.
trianglePackage.copySecondaryEntryPointStylesToRoot = true;


export const triangleExamplePackage = new BuildPackage('triangle-examples', [trianglePackage]);
