import git from 'isomorphic-git';
import * as fs from 'fs';
import * as fse from 'fs-extra';
import {
  join as pathJoin,
  relative as pathRelative
} from 'path';
import { environment } from '../../../environments/environment';
import {
  dump,
  load
} from 'js-yaml';
import { cloneFsRepo } from '@devops-tools/generate';


export enum ProjectRepoVariantPath {
  codeRepo = 'code-repo',
  deploy   = 'deploy',
  generate = 'generate',
  public   = 'public',
  repo     = 'repo'
}

export const DUMMY_REPO_PATH = 'dummy-repo';


export class ProjectRepoService {
  static projectsBasePath = pathJoin(environment.multerConfig.workbenchDest, 'projects');
  public projectRepoPath: string;
  public projectPublicPath: string;
  public projectGeneratePath: string;
  public projectDeployPath: string;
  public projectBuildPath: string;

  constructor(protected projectViewId: string) {
    this.projectRepoPath     = ProjectRepoService.getProjectVariantPath(ProjectRepoService.projectsBasePath,
      projectViewId, ProjectRepoVariantPath.repo);
    this.projectPublicPath   = ProjectRepoService.getProjectVariantPath(ProjectRepoService.projectsBasePath,
      projectViewId, ProjectRepoVariantPath.public);
    this.projectGeneratePath = ProjectRepoService.getProjectVariantPath(ProjectRepoService.projectsBasePath,
      projectViewId, ProjectRepoVariantPath.generate);
    this.projectDeployPath   = ProjectRepoService.getProjectVariantPath(ProjectRepoService.projectsBasePath,
      projectViewId, ProjectRepoVariantPath.deploy);
    this.projectBuildPath    = ProjectRepoService.getProjectVariantPath(ProjectRepoService.projectsBasePath,
      projectViewId, ProjectRepoVariantPath.codeRepo);
  }


  async checkRepo() {
    const root     = await git.findRoot({
      fs,
      filepath: this.projectRepoPath
    });
    const cwd      = process.cwd();
    const rootPath = pathRelative(cwd, root);
    if (rootPath !== this.projectRepoPath || !(/^storage/.exec(rootPath))) {
      throw new Error(`path is outof directory ${this.projectRepoPath}`);
    }
  }

  async addOrUpdateProjectModel(model: object, message = 'update model') {
    // console.log(model);
    const files = [];
    //add themes dir

    files.push('themes/.gitkeep');
    fse.ensureFileSync(pathJoin(this.projectRepoPath, 'themes/.gitkeep'));
    await git.add({
      fs,
      dir     : this.projectRepoPath,
      filepath: 'themes/.gitkeep'
    });

    // add projet model files
    for (let [key, val] of Object.entries(model)) {
      const file        = `${key}.yml`;
      const fileContent = dump(val);
      fs.writeFileSync(pathJoin(this.projectRepoPath, file), fileContent, { encoding: 'utf8' });
      files.push(file);
      await git.add({
        fs,
        dir     : this.projectRepoPath,
        filepath: file
      });
    }

    await git.commit({
      fs,
      dir    : this.projectRepoPath,
      author : {
        name : 'Reiki Devops Service',
        email: 'reiki.devops@users.noreply.github.com'
      },
      message: message
    });

    await this.checkOutCommitToPublic();
    // await git.add({
    //   fs,
    //   dir: this.repoPath,
    //   filepath:
    // })

    //update generate code;

  }

  async checkOutCommitToPublic(ref = 'master') {
    let commitOid = await git.resolveRef({ fs, dir: this.projectRepoPath, ref });

    let files = await git.listFiles({ fs, dir: this.projectRepoPath, ref });

    for (let f of files) {
      // console.log(commitOid);
      let { blob } = await git.readBlob({
        fs,
        dir     : this.projectRepoPath,
        oid     : commitOid,
        filepath: f
      });

      fse.outputFileSync(pathJoin(this.projectPublicPath, f), Buffer.from(blob));
    }

    // console.log(Buffer.from(blob).toString('utf8'));
  }

  async getProjectPublic() {
    const list   = fs.readdirSync(this.projectPublicPath);
    const result = {};
    for (let it of list) {
      const stat = fs.statSync(pathJoin(this.projectPublicPath, it));

      if (stat.isFile()) {
        const fileName   = it.replace(/^(.+?).yml/, '$1');
        result[fileName] = load(fs.readFileSync(pathJoin(this.projectPublicPath, it), { encoding: 'utf8' }));
      }
    }
    return result;
  }

  static getProjectVariantPath(projectsBasePath, viewId, variantName) {
    return pathJoin(projectsBasePath, viewId, variantName);
  }

  static async initProjectRepoService(projectViewId) {
    if (!/^[a-zA-Z0-9]+$/g.exec(projectViewId)) {
      throw new Error('project view id is invalid');
    }

    const repo = new this(projectViewId);
    await repo.checkRepo();

    return repo;
  }

  static async initRepo(projectViewId) {
    if (!/^[a-zA-Z0-9]+$/g.exec(projectViewId)) {
      throw new Error('project view id is invalid');
    }

    const repoPath = this.getProjectVariantPath(this.projectsBasePath, projectViewId, ProjectRepoVariantPath.repo);

    // init git repo
    if (!fs.existsSync(pathJoin(repoPath, '.git'))) {
      await git.init({
        fs,
        dir: repoPath
      });
    }

    // init deafult file
    [
      ProjectRepoVariantPath.public, ProjectRepoVariantPath.deploy,
      ProjectRepoVariantPath.generate, ProjectRepoVariantPath.codeRepo
    ].forEach(it => {
      const dirPath = this.getProjectVariantPath(this.projectsBasePath, projectViewId, it);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
      }
    });
    //clone repo dummy
    const dummyRepoPath = pathJoin(environment.multerConfig.workbenchDest, DUMMY_REPO_PATH);
    const codeRepo      = this.getProjectVariantPath(this.projectsBasePath, projectViewId,
      ProjectRepoVariantPath.codeRepo);
    if (!fs.existsSync(pathJoin(codeRepo, '.git'))) {
      await cloneFsRepo(dummyRepoPath, codeRepo);
    }

    //@ts-ignore
    fse.ensureSymlinkSync(pathJoin(dummyRepoPath, 'node_modules'), pathJoin(codeRepo, 'node_modules'), 'junction');

    const repo = new this(projectViewId);
    await repo.checkRepo();

    return repo;
  }

}
