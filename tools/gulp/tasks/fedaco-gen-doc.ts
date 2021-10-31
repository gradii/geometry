import { dest, src, task } from 'gulp';
import path, { join } from 'path';
import * as through2 from 'through2';
import * as ts from 'typescript';
import VinylFile from 'vinyl';
import { buildConfig } from '../../package-tools';
import { refactorGenerateMd } from './generate-md/refactor-generate-md';

task('fedaco-gen-doc:dist', async () => {
  console.log(buildConfig.projectDir);

  const projectDir = buildConfig.projectDir;
  const outputDir  = join(buildConfig.outputDir, 'output-generate-md');

  src('src/fedaco/test/**/fedaco-integration.spec.ts', {
    base: 'src/fedaco/test/'
  })
    .pipe(
      through2.obj(function (file, _, cb) {
        const base = path.join(file.path, '..');
        if (file.isBuffer()) {

          const filename = 'test.ts';
          const code     = file.contents.toString();

          const sourceFile = ts.createSourceFile(
            filename, code, ts.ScriptTarget.Latest
          );

          const generateContext = {};

          const transformationResult = ts.transform(sourceFile, [
            refactorGenerateMd(generateContext),
          ]);
          console.log(generateContext);

          const transformedSourceFile = transformationResult.transformed[0];
          const printer               = ts.createPrinter();

          const result = printer.printNode(
            ts.EmitHint.Unspecified,
            transformedSourceFile,
            transformedSourceFile
          );

          this.push(
            new VinylFile(
              {
                base    : base,
                path    : path.join(base, 'first.txt'),
                contents: Buffer.from(result)
              }
            )
          );
        }
        cb();
      }))
    .pipe(
      dest(outputDir)
    );
});
