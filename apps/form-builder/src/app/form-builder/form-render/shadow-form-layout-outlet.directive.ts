import { CdkPortalOutlet, DomPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef, ChangeDetectorRef, ComponentFactoryResolver, Directive, Inject, Injector, Input,
  OnDestroy, OnInit, Optional, TemplateRef, ViewChild, ViewContainerRef
} from '@angular/core';
import { isString } from '@gradii/check-type';
import { defer, Subject } from 'rxjs';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ShadowFormLayoutViewer } from '../data-source/shadow-form-layout-viewer';
import { VisibleShadowFormDataSource } from '../data-source/visible-shadow-form-data-source';
import { FormRender } from '../form-render';
import { ShadowForm } from '../shadow-form';
import { ShadowFormLayoutComponent } from './shadow-form-layout-define.directive';

/**
 */
@Directive({
  selector: 'ng-template[shadowFormLayoutOutlet]'
})
export class ShadowFormLayoutOutletDirective implements OnDestroy {
  private _portal: TemplatePortal<any>;
  private _outlet: DomPortalOutlet;

  /** Emits when the menu content has been attached. */
  readonly _attached = new Subject<void>();

  constructor(
    private _componentFactoryResolver: ComponentFactoryResolver,
    private _appRef: ApplicationRef,
    private _injector: Injector,
    private _viewContainerRef: ViewContainerRef,
    @Inject(DOCUMENT) private _document: any,
    private _changeDetectorRef?: ChangeDetectorRef) {
  }

  attach(template: TemplateRef<any>, context: any = {}) {
    if (!this._portal) {
      this._portal = new TemplatePortal(template, this._viewContainerRef);
    }

    this.detach();

    if (!this._outlet) {
      this._outlet = new DomPortalOutlet(this._document.createElement('div'),
        this._componentFactoryResolver, this._appRef, this._injector);
    }

    if (this._changeDetectorRef) {
      this._changeDetectorRef.markForCheck();
    }

    this._portal.attach(this._outlet, context);
    this._attached.next();
  }

  /**
   * Detaches the content.
   * @docs-private
   */
  detach() {
    if (this._portal.isAttached) {
      this._portal.detach();
    }
  }

  ngOnDestroy() {
    if (this._outlet) {
      this._outlet.dispose();
    }
  }

}

/**
 * can render multi portal
 */
@Directive({
  selector: '[shadowFormLayoutOutlet]',
  inputs  : []
})
export class ShadowFormLayoutOutlet implements OnInit {
  _destroy$                       = new Subject();
  private _shadowFormLayoutViewer = new ShadowFormLayoutViewer();

  private _select: string[] = [];

  // @Input()
  // formLayoutSlot: any[] | undefined = [];
  private showed: boolean;

  connected = defer(() => {
    if (this.shadowFormLayoutWrapperComponent) {
      return this.shadowFormLayoutWrapperComponent.connected.pipe(
        takeUntil(this._destroy$),
        switchMap((sfList) => {
          return this._shadowFormLayoutViewer.viewChange.pipe(
            map((selectList) => {
              if (selectList.includes('*') || selectList.length === 0) {
                return sfList;
              }
              return sfList.filter(sf => selectList.includes(sf.name));
            })
          );
        })
      );
    } else {
      return this.visibleShadowFormDataSource.connect(this._shadowFormLayoutViewer);
    }
  });

  // private shadowFormLayoutDefines: any[];

  @Input()
  get select(): string[] | string {
    return this._select;
  }

  set select(value: string[] | string) {
    if (isString(value)) {
      this._select.push(value);
    } else {
      value.forEach(it => {
        if (!this._select.includes(it)) {
          this._select.push(it);
        }
      });
    }

    this._shadowFormLayoutViewer.viewChange.next(this._select);
  }


  selectedPortalList: any[] = [];

  @ViewChild(CdkPortalOutlet, {static: true})
  portalOutlet: CdkPortalOutlet;

  constructor(
    private _cdRef: ChangeDetectorRef,
    private _location: ViewContainerRef,
    private visibleShadowFormDataSource: VisibleShadowFormDataSource,
    private formRender: FormRender,
    @Optional()
    private shadowFormLayoutWrapperComponent: ShadowFormLayoutComponent) {
    console.log('shadowFormLayoutWrapperComponent', shadowFormLayoutWrapperComponent);
  }

  ngOnInit() {
    this.connected.pipe(
      tap((items) => {
        console.log('shadow form', items);
        this.show(items);
      })
    ).subscribe();

    //maybe observable
    // if (this.shadowFormLayoutWrapperComponent) {
    //   this.shadowFormLayoutDefines = this.shadowFormLayoutWrapperComponent.shadowFormLayoutDefines;
    // } else {
    //   this.shadowFormLayoutDefines = this.formRender.shadowFormLayoutDefines;
    // }

  }

  show(shadowForms: ShadowForm[]) {
    // if (!this.showed) {
    this._location.clear();
    this.selectedPortalList = [];
    shadowForms.forEach(it => {
      const define = this.formRender.shadowFormLayoutDefines.find(
        define => define.shadowFormName === it.name
      );
      if (define) {
        this._location.createEmbeddedView(define._templateRef, {
          $implicit: it
          // temp.portal.attach(this.portalOutlet, {
          //   $implicit: this.shadowFormLayoutWrapperComponent.shadowForm
          // });
        });
      }
    });

    // this.showed = true;
    this._cdRef.markForCheck();
    // }
  }

  hide() {
    this.showed = false;
    this.portalOutlet.detach();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  ngAfterViewInit() {
    // console.log(this.formLayoutSlot);
    // console.log(this.formRender.shadowFormLayouts);

    // this._cdRef.detectChanges()

    // for (const slotName of this.formLayoutSlot) {
    //   const shadowFormLayout = this.formRender.shadowFormLayouts.find(it => it.layoutFor === slotName);
    //
    //   console.log(shadowFormLayout);
    //   this._location.createEmbeddedView(shadowFormLayout.templateRef);
    // }
  }
}
