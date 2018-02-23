import { Component, Input } from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import 'rxjs/add/operator/first';

import { EXAMPLE_COMPONENTS, LiveExample } from '@gradii/triangle-examples';
import { CopierService } from '../copier/copier.service';
import { MessageComponent, MessageService } from '@gradii/triangle/message';

@Component({
  selector   : 'example-viewer',
  templateUrl: './example-viewer.html',
  styleUrls  : ['./example-viewer.scss']
})
export class ExampleViewer {
  /** Component portal for the currently displayed example. */
  selectedPortal: ComponentPortal<any>;

  /** String key of the currently displayed example. */
  _example: string;

  exampleData: LiveExample;

  _exampleFiles: any;

  /** Whether the source for the example is being displayed. */
  showSource = false;

  constructor(private snackbar: MessageService,
              private copier: CopierService) {
  }

  get example() {
    return this._example;
  }

  get exampleInfo() {
    return this.exampleData[this._example];
  }

  @Input()
  set example(example: string) {
    if (example && EXAMPLE_COMPONENTS[example]) {
      this._example = example;
      this.exampleData = EXAMPLE_COMPONENTS[example];
      this._exampleFiles = this.exampleFiles();
      this.selectedPortal = new ComponentPortal(this.exampleData.component);
    } else {
      console.warn('MISSING EXAMPLE: ', example);
    }
  }

  toggleSourceView(): void {
    this.showSource = !this.showSource;
  }

  exampleFiles() {
    const data = EXAMPLE_COMPONENTS[this._example];

    let files = [data.relativePath];
    if (data.additionalFiles) {
      files = files.concat(data.additionalFiles);
    }

    return files.map((relative) => {
      return {
        name: relative.split(/(\\|\/)/g).pop(),
        path: `/assets/examples/${relative}.html`
      };
    }, {});
  }

  exampleFileUrl(extension: string) {
    return `/assets/examples/${this.exampleInfo.relativePath}-example-${extension.toLowerCase()}.html`;
  }

  copySource(text: string) {
    if (this.copier.copyText(text)) {
      this.snackbar.info('Code copied', {duration: 2500});
    } else {
      this.snackbar.info('Copy failed. Please try again!', {duration: 2500});
    }
  }
}
