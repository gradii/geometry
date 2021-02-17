/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title alert-basic
 */
@Component({
  selector: 'tri-demo-alert-basic',
  template: `
    <tri-alert [type]="'success'" [showIcon]="true" message="Success Text">
      <div *triAlertDescription>
        <p>There are many different ways to organize a paragraph. The organization you choose will depend on the
          controlling idea of the paragraph. <strong>Below are a few possibilities for organization, with links to brief
            examples:</strong></p>
        <ul>
          <li><strong>Narration</strong>: Tell a story. Go chronologically, from start to finish. (<a
            href='https://writingcenter.unc.edu/tips-and-tools/paragraphs/paragraph-development-examples/'>See an
            example.</a>)
          </li>
          <li><strong>Description</strong>: Provide specific details about what something looks, smells, tastes, sounds,
            or feels like. Organize spatially, in order of appearance, or by topic. (<a
              href='https://writingcenter.unc.edu/tips-and-tools/paragraphs/paragraph-development-examples/'>See an
              example.</a>)
          </li>
          <li><strong>Process</strong>: Explain how something works, step by step. Perhaps follow a sequence—first,
            second, third. (<a
              href='https://writingcenter.unc.edu/tips-and-tools/paragraphs/paragraph-development-examples/'>See an
              example.</a>)
          </li>
          <li><strong>Classification</strong>: Separate into groups or explain the various parts of a topic. (<a
            href='https://writingcenter.unc.edu/tips-and-tools/paragraphs/paragraph-development-examples/'>See an
            example.</a>)
          </li>
          <li><strong>Illustration</strong>: Give examples and explain how those examples prove your point. (See the
            detailed example in the next section of this handout.)
          </li>

        </ul>
      </div>
    </tri-alert>
  `
})
export class TriDemoAlertLongDescriptionComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
