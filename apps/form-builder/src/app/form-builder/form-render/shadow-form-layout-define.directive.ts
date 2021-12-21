import { ContentChild, Directive, Host, Input, OnDestroy, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormRender } from '../form-render';
import { ShadowForm } from '../shadow-form';
import { FormLayoutDefine } from './form-layout-define.directive';
import { FormLayoutService } from './form-layout.service';
import { ShadowFormLayoutOutlet } from './shadow-form-layout-outlet.directive';
import { TemplatePortal } from '@angular/cdk/portal';
import { isString } from '@gradii/check-type';
import { ShadowFormLayoutViewer } from '../data-source/shadow-form-layout-viewer';
import { VisibleShadowFormDataSource } from '../data-source/visible-shadow-form-data-source';
import { shareReplay, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';


@Directive({
  selector: 'ng-template[shadowFormLayoutDefine]'
  // template: `
  //   <!--    <div>-->
  //   <!--      <div>-->
  //   <!--        <ng-template [formLayoutSlot]="formLayoutSlot"></ng-template>-->
  //   <!--      </div>-->
  //   <!--    </div>-->
  // `
})
export class ShadowFormLayoutDefine {
  private _shadowFormName: string;

  formLayoutSlot = [''];

  @Input('shadowFormLayoutDefine')
  get shadowFormName(): string {
    return this._shadowFormName;
  }

  set shadowFormName(value: string) {
    if (isString(value)) {
      this.shadowForm = this.layoutService.findShadowFormFromName(value);
    }
    this._shadowFormName = value;
  }

  shadowForm!: ShadowForm;

  public portal: TemplatePortal<any>;

  constructor(public _templateRef: TemplateRef<any>,
              private _viewContainerRef: ViewContainerRef,
              private layoutService: FormLayoutService
  ) {
    this.portal = new TemplatePortal(_templateRef, _viewContainerRef, {});
  }
}

@Directive({
  selector: 'ng-template[shadowFormLayout]',
  host: {
    'class': 'shadow-form-layout'
  }
})
export class ShadowFormLayoutComponent implements OnDestroy {
  private _destroy$ = new Subject();

  private _viewRef;
  private _ifVisible: any[] | undefined = [];

  private _shadowFormLayoutViewer: ShadowFormLayoutViewer = new ShadowFormLayoutViewer();

  @Input()
  get ifVisible(): any[] | undefined {
    return this._ifVisible;
  }

  set ifVisible(value: any[] | undefined) {
    if (!value || value.includes('*')) {
      this._shadowFormLayoutViewer.viewChange.next(['*']);
    } else {
      this._shadowFormLayoutViewer.viewChange.next(value);
    }
    this._ifVisible = value;
  }

  connected = this._shadowFormDataSource.connect(this._shadowFormLayoutViewer)
    .pipe(
      takeUntil(this._destroy$),

      shareReplay(1),
    );


  visible = true;

  shadowFormLayoutDefines: ShadowFormLayoutDefine[] = [];

  // /**
  //  * @deprecated
  //  */
  // shadowForm: ShadowForm;

  selectShadowForms: ShadowForm[] = [];

  rendered = false;

  _updateView() {
    if (this.visible) {
      // if (!this.rendered) {
      //   this.rendered = true;
      if (!this._viewRef) {
        const nameList = this.selectShadowForms.map(it=>it.name);
        this._viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, {
          $implicit: this.selectShadowForms,
          nameList,
        });
      }
      // this._viewContainerRef.createEmbeddedView(this._templateRef);
      // }
    } else {
      this._viewRef = undefined;
      this._viewContainerRef.clear();
    }
  }


  // isVisible() {
  //   if (this._select) {
  //     const shadowForms = this.formRenderService.visibleShadowForms.filter(
  //       it => this._select.includes(it.name)
  //     );
  //     if (shadowForms && shadowForms.length) {
  //       this.selectShadowForms = shadowForms;
  //       // this.shadowForm = this.selectShadowForms[0];
  //       // this.attachOutlet(shadowForms);
  //       return true;
  //     }
  //   }
  //   // this.shadowFormLayoutOutlet.hide();
  // }

  // attachOutlet(shadowForms) {
  //   this.shadowFormLayoutOutlet?.show(shadowForms);
  //
  //   this.shadowFormLayoutOutletDirective?.attach(
  //     this.shadowFormLayoutDefines[0]._templateRef,
  //     {
  //       $implicit: this.shadowForm
  //     });
  // }

  /**
   * @deprecated
   */
  @ContentChild(ShadowFormLayoutOutlet)
  shadowFormLayoutOutlet: ShadowFormLayoutOutlet;

  // @ContentChild(ShadowFormLayoutOutletDirective)
  // shadowFormLayoutOutletDirective: ShadowFormLayoutOutletDirective;

  constructor(
    public formLayout: FormLayoutDefine,
    public formRender: FormRender,
    public formRenderService: FormLayoutService,
    @Host() private _templateRef: TemplateRef<any>,
    private _viewContainerRef: ViewContainerRef,
    private _shadowFormDataSource: VisibleShadowFormDataSource
  ) {
    console.log('form layout slot', formLayout);

    // this._init();
  }

  ngOnInit() {
    // console.log(this.select);
    // console.log(this.formRender.shadowFormLayouts);
    this._viewContainerRef.clear();
    for (const slotName of this._ifVisible) {
      const shadowFormLayout = this.formRender.shadowFormLayoutDefines.find(
        it => it.shadowFormName === slotName
      );

      this.shadowFormLayoutDefines.push(shadowFormLayout);
      // console.log(shadowFormLayout);
      // this._viewContainerRef.createEmbeddedView(shadowFormLayout.templateRef);
    }

    this.connected.pipe(
      tap((visibleSfList) => {
        console.log(visibleSfList);

        if (visibleSfList && visibleSfList.length) {
          this.selectShadowForms = visibleSfList;
          this.visible = true;
        } else {
          this.visible = false;
        }

        this._updateView();
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
