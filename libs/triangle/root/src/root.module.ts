import { CommonModule, DOCUMENT } from '@angular/common';
import { APP_INITIALIZER, ComponentFactoryResolver, ComponentRef, Inject, Injector, NgModule, OnDestroy, Optional } from '@angular/core';
import { createNzRootInitializer, ROOT_CONFIG } from './root-config';
import { RootStyleComponent } from './root-style.component';
import { RootComponent } from './root.component';

@NgModule({
  exports        : [RootComponent],
  declarations   : [RootComponent, RootStyleComponent],
  imports        : [CommonModule],
  entryComponents: [RootStyleComponent],
  providers      : [
    {
      provide   : APP_INITIALIZER,
      multi     : true,
      useFactory: createNzRootInitializer,
      deps      : [DOCUMENT, [new Optional(), ROOT_CONFIG]]
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
