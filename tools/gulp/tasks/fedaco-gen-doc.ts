import * as fse from 'fs-extra';
import { dest, src, task, } from 'gulp';
import path, { join } from 'path';
import * as through2 from 'through2';
import * as ts from 'typescript';
import VinylFile from 'vinyl';
import { buildConfig } from '../../package-tools';
import { refactorGenerateMd } from './generate-md/refactor-generate-md';


const testFileNamespace = {
  'database fedaco integration': 'model-functions'
}

const projectDir = buildConfig.projectDir;
const outputDir  = join(buildConfig.outputDir, 'output-generate-md');

task('fedaco-gen-doc:dist', async () => {
  console.log(buildConfig.projectDir);

  await fse.emptyDir(outputDir);

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
            filename, code, ts.ScriptTarget.ES2020, true
          );

          const generateContext: { path: '', files: any[], prerequisites: { type: string, text?: string, code?: string }[] } = {
            path         : '',
            files        : [],
            prerequisites: []
          };

          const transformationResult = ts.transform(sourceFile, [
            refactorGenerateMd(generateContext, sourceFile),
          ]);

          // console.log(generateContext);

          // const transformedSourceFile = transformationResult.transformed[0];
          // const printer               = ts.createPrinter();
          //
          // const result = printer.printNode(
          //   ts.EmitHint.Unspecified,
          //   transformedSourceFile,
          //   transformedSourceFile
          // );

          if (generateContext.prerequisites.length > 0) {
            this.push(
              new VinylFile(
                {
                  base    : base,
                  path    : path.join(base, generateContext.path, 'prerequisite' + '.md'),
                  contents: Buffer.from(
                    '# Prerequisites\n' +
                    generateContext.prerequisites.map(it => {
                      if (it.type === 'code') {
                        return `\`\`\`typescript
${it.code.trim().replace(/^\{(.+)\}/s, '$1')}
\`\`\``;
                      } else if (it.type === 'text') {
                        return `${it.text.trim()}\n`;
                      }
                      throw new Error('unknown type ');
                    }).join('\n')


                  )
                }
              )
            );
          }
          for (let file of generateContext.files) {
            this.push(
              new VinylFile(
                {
                  base    : base,
                  path    : file.namedKey ?
                    path.join(base, (testFileNamespace[generateContext.path] || 'functions') + '/' + file.namedKey, file.fileName + '.md') :
                    path.join(base, generateContext.path, file.fileName + '.md'),
                  contents: Buffer.from(
                    `${file.content}\n\n
----
see also [prerequisites]("./${file.namedKey ? '../' + generateContext.path + '/' : ''}prerequisite.md")
`
                  )
                }
              )
            );
          }
        }
        cb();
      }))
    .pipe(
      dest(outputDir)
    );
});
