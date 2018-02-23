import { join } from 'path';
import { writeFileSync } from 'fs';

/** Creates a package.json for a secondary entry-point with the different bundle locations. */
export function createEntryPointPackageJson(destDir: string, packageName: string,
                                            entryPointName: string) {
  const content = {
    name   : `@gradii/${packageName}/${entryPointName}`,
    typings: `../${entryPointName}.d.ts`,
    main   : `../_bundles/${packageName}-${entryPointName}.umd.js`,
    module : `../_esm5/${entryPointName}.es5.js`,
    es2015 : `../_esm2015/${entryPointName}.js`,
  };

  writeFileSync(join(destDir, 'package.json'), JSON.stringify(content, null, 2), 'utf-8');
}
