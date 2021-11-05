import { camelCase, capitalCase } from '@gradii/fedaco';
import * as fse from 'fs-extra';
import { task, } from 'gulp';
import { join } from 'path';
import { buildConfig } from '../../package-tools';


const projectDir = buildConfig.projectDir;
const outputDir  = join(buildConfig.outputDir, 'output-generate-md');

task('concat-functions:dist', async () => {
  console.log(buildConfig.projectDir);

  const functionsDir = 'dist/output-generate-md/model-functions';
  if(!fse.existsSync(functionsDir)) {
    return;
  }
  const list         = fse.readdirSync(functionsDir);

  list.forEach(it => {
    const currentDir = join(functionsDir, it);
    const stats      = fse.statSync(currentDir);

    if (stats.isDirectory()) {
      const list          = fse.readdirSync(currentDir, {withFileTypes: true});
      const totalContents = [`# Function ${camelCase(it)}`];
      list.forEach(fileDirent => {
        if (fileDirent.isFile()) {
          totalContents.push('\n',
            fse.readFileSync(join(currentDir, fileDirent.name), {encoding: 'utf8'}));
        }
      });
      fse.writeFileSync(join(functionsDir, it + '.md'), totalContents.join(''));
      fse.removeSync(currentDir)
    }
  });


});
