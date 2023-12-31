import { task } from 'gulp';
import { Project } from 'ts-morph';


task('refactor-fn', async () => {

  const project = new Project();

  project.addSourceFilesAtPaths('./libs/triangle/tree-view/src/**/*.ts');

  const sourceFiles = project.getSourceFiles();

  for (const sourceFile of sourceFiles) {

    const path = sourceFile.getFilePath();

    console.log(path);

    if (path.includes('_internal')) {
      const functions = sourceFile.getFunctions();

      for (const fun of functions) {
        const funName = fun.getName();
        if (!funName.startsWith('_')) {
          fun.rename(`_${funName}`);
        }
      }

    }

  }

  await project.save();

});
