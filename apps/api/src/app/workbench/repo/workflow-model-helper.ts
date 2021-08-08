import * as fs from 'fs-extra';
import { join as pathJoin } from 'path';
import { safeLoad } from 'js-yaml';


export class WorkflowModelHelper {
  constructor(public readonly projectPublicPath) {
  }

  getWorkflowInfo() {
    const content = fs.readFileSync(
      pathJoin(
        this.projectPublicPath,
        'workflowList.yml'
      ), { encoding: 'utf8' });

    return safeLoad(content);
  }
}
