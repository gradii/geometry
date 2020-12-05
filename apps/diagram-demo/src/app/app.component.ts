import { Component, ContentChild, Directive, Input, TemplateRef } from '@angular/core';


@Component({
  selector: 'applications-root',
  template: `
<!--    <header class="flex">-->
<!--      <h1>Welcome to {{ title }}!</h1>-->
<!--    </header>-->
    <main>
      <demo-simple></demo-simple>

    </main>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'diagram-demo';
}
