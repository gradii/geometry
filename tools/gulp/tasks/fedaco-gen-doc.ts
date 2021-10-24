import { dest, src, task } from 'gulp';
import { buildConfig } from '../../package-tools';
import { join } from 'path';
import * as through2 from 'through2';
import * as ts from 'typescript';
import { refactorGenerateMd } from './generate-md/refactor-generate-md';

task('fedaco-gen-doc:dist', async () => {
  console.log(buildConfig.projectDir);

  const projectDir = buildConfig.projectDir;
  const outputDir = join(buildConfig.outputDir, 'output-refactor-ts');

  src('src/fedaco/test/**/fedaco-integration.spec.ts', {
    base: 'src/fedaco/test/'
  })
    .pipe(
      through2.obj((file, _, cb) => {
        if (file.isBuffer()) {

          const filename = 'test.ts';
          const code = file.contents.toString();

          const sourceFile = ts.createSourceFile(
            filename, code, ts.ScriptTarget.Latest
          );

          const transformationResult = ts.transform(sourceFile, [
            refactorGenerateMd(),
          ]);

          const transformedSourceFile = transformationResult.transformed[0];
          const printer = ts.createPrinter();

          const result = printer.printNode(
            ts.EmitHint.Unspecified,
            transformedSourceFile,
            transformedSourceFile
          );

          file.contents = Buffer.from(result);
        }
        cb(null, file);
      }))
    .pipe(
      dest(outputDir)
    );
});
