import {
  ApplicationRef,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Injectable,
  ModuleWithComponentFactories,
  TemplateRef,
  Type
} from '@angular/core';
import { isObservable, isPresent, isPromise } from '@gradii/triangle/util';
import { Observable, Subscription } from 'rxjs';
import { ConfirmComponent } from './confirm.component';
import { ConfirmOptions, ModalOptions } from './modal-options.provider';
import { ModalSubject } from './modal-subject.service';
import { ModalComponent } from './modal.component';

let zIndex = 1000;

export interface ConfigInterface {
  type?: string;
  title?: string;
  confirmType?: string;
  /* tslint:disable-next-line:no-any */
  content?: string | TemplateRef<any> | Type<any>;
  contentContext?: any;
  width?: string | number;
  zIndex?: number;
  iconType?: string;
  okText?: string;
  cancelText?: string;
  okDisabled?: boolean | Function | Observable<boolean>;
  cancelDisabled?: boolean | Function | Observable<boolean>;
  style?: object;
  class?: string;
  closable?: boolean;
  maskClosable?: boolean;
  wrapClassName?: string;
  footer?: TemplateRef<void> | boolean;
  showConfirmLoading?: boolean;
  //Promise及Observable 默认成功关闭对话框 Subscription teardown 关闭对话框
  onOk?: () => void | boolean | Promise<any> | Observable<any> | Subscription;
  //Promise及Observable 默认成功关闭对话框 Subscription teardown 关闭对话框
  onCancel?: () => void | boolean | Promise<any> | Observable<any> | Subscription;
  componentParams?: object;
  moduleWithComponentFactories?: ModuleWithComponentFactories<void>;
}

@Injectable()
export class ModalService {
  _modalCompFactory: ComponentFactory<ModalComponent>;
  _confirmCompFactory: ComponentFactory<ConfirmComponent>;

  constructor(private _appRef: ApplicationRef, private _cfr: ComponentFactoryResolver) {
    this._modalCompFactory = this._cfr.resolveComponentFactory(ModalComponent);
    this._confirmCompFactory = this._cfr.resolveComponentFactory(ConfirmComponent);
  }

  _initConfig(config: Object, options: Object = {}): Object {
    const props = {};
    const optionalParams: string[] = [
      'componentParams', // 将componentParams放在第一位是因为必须在content赋值前进行赋值
      'visible',
      'title',
      'content',
      'contentContext',
      'footer',
      'width',
      'zIndex',
      'okText',
      'cancelText',
      'okDisabled',
      'style',
      'class',
      'onOk',
      'onCancel',
      'closable',
      'maskClosable',
      'wrapClassName',
      'iconType',
      'confirmType',
      'moduleWithComponentFactories'
    ];

    config = Object.assign({zIndex: ++zIndex}, options, config);
    optionalParams.forEach(key => {
      if (config[key] !== undefined) {
        props[key] = config[key];
      }
    });

    const isShowConfirmLoading = !!config['showConfirmLoading'];
    props['onOk'] = this._getConfirmCb(props['onOk'], isShowConfirmLoading);
    props['onCancel'] = this._getConfirmCb(props['onCancel']);
    // 在service模式下，不需要onOk，防止触发this.onOk.emit(e);
    // delete props['onOk'];
    // delete props['onCancel'];
    return props;
  }

  _getConfirmCb(fn?: Function, isShowConfirmLoading: boolean = false): Function {
    return (_close, _instance) => {
      if (isShowConfirmLoading) {
        _instance.confirmLoading = true;
      }
      if (fn) {
        const ret = fn();
        if (ret === false) {
          return;
        } else if (ret === true || !isPresent(ret)) {
          _close();
        } else if (isPromise(ret)) {
          ret.then(_close);
        } else if (isObservable(ret)) {
          (ret as Observable<any>).subscribe(_ => _close());
        }
      } else {
        _close();
      }
    };
  }

  _open(props: ConfigInterface, factory: ComponentFactory<any>): ModalSubject {
    // 在body的内部最前插入一个<tri-modal></tri-modal>方便进行ApplicationRef.bootstrap
    document.body.insertBefore(document.createElement(factory.selector), document.body.firstChild);
    // document.body.appendChild(document.createElement(factory.selector));
    let customComponentFactory: ComponentFactory<any>;
    let compRef: ComponentRef<any>;
    let instance: any;
    let subject: any;

    if (props['content'] instanceof Type) {
      customComponentFactory = this._cfr.resolveComponentFactory(<Type<any>>props['content']);
      // 将编译出来的ngmodule中的用户component的factory作为modal内容存入
      props['content'] = <any>customComponentFactory;
    }

    compRef = this._appRef.bootstrap(factory);
    instance = compRef.instance;
    subject = instance.subject;

    ['onOk', 'onCancel'].forEach((eventType: string) => {
      subject.on(eventType, () => {
        const eventHandler = props[eventType];
        if (eventHandler) {
          eventHandler(() => {
            instance.visible = false;
            setTimeout(() => {
              compRef.destroy();
            }, 200);
          }, instance);
        }
      });
    });

    let _props = {
      ...props,
      ...{
        visible: true
      }
    };
    delete _props['onOk'];
    delete _props['onCancel'];
    Object.assign(instance, _props);

    return subject;
  }

  // protected createComponentModule (componentType: any) {
  //   @NgModule({
  //     declarations: [ componentType ]
  //   })
  //   class CustomComponentModule {}
  //   return CustomComponentModule;
  // }

  /**
   * Open modal dialog
   */
  open(config: ConfigInterface): ModalSubject {
    const options: ModalOptions = new ModalOptions();
    const props = this._initConfig(config, options);
    return this._open(props, this._modalCompFactory);
  }

  /**
   * Open confirm dialog
   */
  _openConfirm(config: ConfigInterface): ModalSubject {
    const options: ConfirmOptions = new ConfirmOptions();
    const props = this._initConfig(config, options);
    return this._open(props, this._confirmCompFactory);
  }

  /**
   * Open info dialog
   */
  info(props: ConfigInterface): ModalSubject {
    const config = {
      ...{
        confirmType: 'info',
        iconType   : 'info-circle'
      },
      ...props
    };
    return this._openConfirm(config);
  }

  /**
   * Open success dialog
   */
  success(props: ConfigInterface): ModalSubject {
    const config = {
      ...{
        confirmType: 'success',
        iconType   : 'check-circle'
      },
      ...props
    };
    return this._openConfirm(config);
  }

  /**
   * Open error dialog
   */
  error(props: ConfigInterface): ModalSubject {
    const config = {
      ...{
        confirmType: 'error',
        iconType   : 'cross-circle'
      },
      ...props
    };
    return this._openConfirm(config);
  }

  /**
   * Open warning dialog
   */
  warning(props: ConfigInterface): ModalSubject {
    const config = {
      ...{
        confirmType: 'warning',
        iconType   : 'exclamation-circle'
      },
      ...props
    };
    return this._openConfirm(config);
  }

  /**
   * Open confirm dialog
   */
  confirm(props: ConfigInterface): ModalSubject {
    const config = {
      ...{
        confirmType: 'confirm',
        okText     : '确 定',
        cancelText : '取 消'
      },
      ...props
    };
    return this._openConfirm(config);
  }
}
