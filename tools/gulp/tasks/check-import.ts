import * as fse from 'fs-extra';
import { glob } from 'glob';
import { task } from 'gulp';
import path from 'path';
import { bindNodeCallback, EMPTY, merge } from 'rxjs';
import { mergeMap, tap } from 'rxjs/operators';
import { buildConfig } from '../../package-tools';

/** Deletes the output directory. */
task('check-import', async () => {
  await bindNodeCallback(glob)(path.join(buildConfig.packagesDir, '*/*/')).pipe(
    mergeMap((dirList) => {

      return merge(...(dirList as string[]).map((it: string) => {
          const stat = fse.statSync(it);
          if (stat.isDirectory()) {
            it = path.relative(buildConfig.packagesDir, it);

            return bindNodeCallback(glob)(path.join(buildConfig.packagesDir, it, '**/*.ts')).pipe(
              tap((files) => {
                (files as string[]).forEach(file => {
                  if (!/\.spec\.ts$/.exec(file)) {
                    const content = fse.readFileSync(file, 'utf8');
                    if (content.includes(`@gradii/${it}`)) {
                      console.error(file);
                    }
                    (dirList as string[]).forEach(pkgDir => {
                      const subPackage = path.relative(buildConfig.packagesDir, pkgDir);
                      if (content.includes(`../${subPackage}`)) {
                        console.error(file);
                      }
                      const lastDir = path.basename(pkgDir);
                      if (content.includes(`../../${lastDir}`)) {
                        console.error(file);
                      }
                    });
                  }
                });
              })
            );
          }
          return EMPTY;
        })
      );
    })
  ).toPromise();

});
