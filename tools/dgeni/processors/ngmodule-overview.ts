import { DocCollection, Processor } from 'dgeni';

class NgmoduleOverview {
  public docType = 'ngmoduleOverview';
  public ngModule;
  name: string;
  id: string;
}

export class NgmoduleOverviewProcessor implements Processor {
  name = 'ngmodule-overview';
  $runAfter = ['component-grouper'];
  $runBefore = ['docs-processed'];

  $process(docs: DocCollection) {
    const moduleDocs = docs.map(doc => {
      const moduleOverview = new NgmoduleOverview();
      moduleOverview.ngModule = doc.ngModule;
      moduleOverview.name = doc.name;
      moduleOverview.id = `ngmodule-overview-${doc.name}`;
      return moduleOverview;
    });
    return docs.concat(moduleDocs);
  }
}
