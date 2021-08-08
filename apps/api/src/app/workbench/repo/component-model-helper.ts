import * as fs from 'fs-extra';
import { join as pathJoin } from "path";
import { safeLoad } from 'js-yaml';

export class ComponentModelHelper {
  constructor(public readonly projectPublicPath) {
  }

  getComponentListInfo(): any[] {
    const content = fs.readFileSync(
      pathJoin(
        this.projectPublicPath,
        'componentList.yml'
      ), { encoding: 'utf8' });

    //@ts-ignore
    return safeLoad(content);
  }
}
