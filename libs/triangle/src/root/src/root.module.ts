import {
  NgModule,
  OnDestroy,
  ComponentRef,
  ComponentFactoryResolver,
  Inject,
  Optional,
  Injector,
  APP_INITIALIZER
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DOCUMENT } from '@angular/common';
import { RootComponent } from './root.component';
import { RootStyleComponent } from './root-style.component';
import { ROOT_CONFIG, createNzRootInitializer } from './root-config';

@NgModule({
  exports: [RootComponent],
  declarations: [RootComponent, RootStyleComponent],
  imports: [CommonModule],
  entryComponents: [RootStyleComponent],
  providers: [
    {
      provide: APP_INITIALIZER,
      multi: true,
      useFactory: createNzRootInitializer,
      deps: [DOCUMENT, [new Optional(), ROOT_CONFIG]]
    }
  ]
})
export class TriRootModule implements OnDestroy {
  private styleHostComponent: ComponentRef<RootStyleComponent>;

  constructor(@Inject(DOCUMENT) _document: any, injector: Injector, resolver: ComponentFactoryResolver) {
    const componentFactory = resolver.resolveComponentFactory(RootStyleComponent);
    const div = _document.createElement('div');
    this.styleHostComponent = componentFactory.create(injector, null, div);
  }

  ngOnDestroy() {
    this.styleHostComponent.destroy();
  }
}
