import {join, resolve as resolvePath} from 'path';
import {spawn} from 'child_process';
import {writeFileSync, readFileSync} from 'fs';
import {sync as glob} from 'glob';
import {red} from 'chalk';
import {BuildPackage} from './build-package';
import {existsSync} from 'fs';

/** Incrementing ID counter. */
let nextId = 0;

/** Compiles the TypeScript sources of a primary or secondary entry point. */
export async function compileEntryPoint(buildPackage: BuildPackage, tsconfigName: string,
                                        secondaryEntryPoint = '', es5OutputPath?: string) {
  let entryPointPath;
  if (existsSync(join(buildPackage.sourceDir, secondaryEntryPoint))) {
    entryPointPath = join(buildPackage.sourceDir, secondaryEntryPoint);
  } else {
    entryPointPath = join(buildPackage.sourceDir, 'src', secondaryEntryPoint);
  }

  const entryPointTsconfigPath = join(entryPointPath, tsconfigName);
  const ngcFlags = ['-p', entryPointTsconfigPath];

  if (es5OutputPath) {
    ngcFlags.push('--outDir', es5OutputPath);
    ngcFlags.push('--target', 'ES5');
  }

  return new Promise((resolve, reject) => {
    const ngcPath = resolvePath('./node_modules/.bin/ngc');
    const childProcess = spawn(ngcPath, ngcFlags, {shell: true});

    // Pipe stdout and stderr from the child process.
    childProcess.stdout.on('data', (data: any) => console.log(`${data}`));
    childProcess.stderr.on('data', (data: any) => console.error(red(`${data}`)));

    childProcess.on('exit', (exitCode: number) => exitCode === 0 ? resolve() : reject());
  })
    .catch(() => {
      const error = red(`Failed to compile ${secondaryEntryPoint} using ${entryPointTsconfigPath}`);
      console.error(error);
    });
}

/** Renames `ɵa`-style re-exports generated by Angular to be unique across compilation units. */
export function renamePrivateReExportsToBeUnique(buildPackage: BuildPackage,
                                                 secondaryEntryPoint = '') {
  // When we compiled the typescript sources with ngc, we do entry-point individually.
  // If the root-level module re-exports multiple of these entry-points, the private-export
  // identifiers (e.g., `ɵa`) generated by ngc will collide. We work around this by suffixing
  // each of these identifiers with an ID specific to this entry point. We make this
  // replacement in the js, d.ts, and metadata output.
  if (buildPackage.exportsSecondaryEntryPointsAtRoot && secondaryEntryPoint) {
    const entryPointId = nextId++;
    const outputPath = join(buildPackage.outputDir, secondaryEntryPoint);
    const esm5OutputPath = join(buildPackage.esm5OutputDir, secondaryEntryPoint);

    addIdToGlob(outputPath, entryPointId);
    addIdToGlob(esm5OutputPath, entryPointId);
  }
}

/** Updates exports in designated folder with identifier specified. */
function addIdToGlob(outputPath: string, entryPointId: number): void {
  glob(join(outputPath, '**/*.+(js|d.ts|metadata.json)')).forEach(filePath => {
    let fileContent = readFileSync(filePath, 'utf-8');
    fileContent = fileContent.replace(/(ɵ[a-z]+)/g, `$1${entryPointId}`);
    writeFileSync(filePath, fileContent, 'utf-8');
  });
}
