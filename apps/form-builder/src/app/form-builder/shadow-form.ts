import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ConnectedLinkEvent } from './events/connected-link.event';
import { DisconnectLinkEvent } from './events/disconnect-link.event';
import { Form } from './form';
import { FormField } from './form-field/form-field';
import { Link } from './link/link';
import { Visibility } from './visibility';


export class ShadowForm extends Visibility {
  _connectedRelation = new BehaviorSubject([]);

  _linkShadowForm = new WeakMap<ShadowForm, Link>();

  mainForm: Form;

  controlledBy: ShadowForm;

  dependence: any[] = [];

  formGroup       = new FormGroup({});
  shadowFormGroup = new FormGroup({});
  // shadowChainFormGroup = new FormGroup({})

  allFormGroup = new FormGroup({});

  visible = false;

  connectedLink = new Set<Link>();

  connectionChange = new Subject();
  connectionEvent  = new Subject();

  connectedLinkOutPorts = new Set<Link>();
  connectedLinkInPorts  = new Set<Link>();

  constructor(public name: string,
              public fields: FormField[]) {
    super();

    fields.forEach(it => {
      this.formGroup.addControl(it.name, it.formControl);
    });

  }

  copyFormGroup() {
    // return new FormGroup();
  }

  first() {
    if (this.fields.length) {
      return this.fields[0];
    }
    return undefined;
  }

  updateVisible(value: boolean) {
    // this.connectedLink.forEach()
    this.visible = value;

    this.connectedLink.forEach(it => {
      it.updateVisible(value);
    });
  }

  connected() {
    return this._connectedRelation;
  }

  rebuildShadowFormGroup() {
    // const shadowFormGroup = new FormGroup({});
    const keys: string[] = Object.keys(this.shadowFormGroup.controls);

    this.connectedLinkOutPorts.forEach(link => {
      const targetForm       = link.target;
      const formName: string = targetForm.name;
      if (keys.includes(formName)) {
        delete keys[keys.indexOf(formName)];
        this.shadowFormGroup.setControl(formName, targetForm.formGroup);
      } else {
        this.shadowFormGroup.addControl(formName, targetForm.formGroup);
      }


      // shadowFormGroup.addControl(formName, targetForm.formGroup);
      // outConnectedShadowForm.push(link.target)
    });

    keys.forEach(it => {
      if (it != undefined) {
        this.shadowFormGroup.removeControl(it);
      }
    });

    // this.shadowFormGroup = shadowFormGroup;
  }

  connect(form: ShadowForm, predicate: any, formFieldValue: any) {
    if (this._linkShadowForm.has(form)) {
      // have linked
      // return this._linkShadowForm
      throw new Error(`have linked form`);
    }
    // build a link when link.
    const link = new Link(this, form, predicate, formFieldValue);

    this._linkShadowForm.set(form, link);

    return link.start()
      .pipe(
        tap((linked) => {
          let event;
          if (linked) {
            event = new ConnectedLinkEvent();
            this.connectedLink.add(link);
          } else {
            event = new DisconnectLinkEvent();
            this.connectedLink.delete(link);
          }
          this.connectionEvent.next(event);
          this.connectionChange.next(link);

          this.rebuildShadowFormGroup();
        })
        // finalize(() => {
        //   this.connectedLink.delete(link);
        // })
      );
  }

  disconnect(form: any) {
    const link = this._linkShadowForm.get(form);
    if (link) {
      this.connectedLink.delete(link);
      link.stop();
      link.destroy();
      this._linkShadowForm.delete(form);
    }
  }

  controlUseOneField(form: ShadowForm, formFieldValue: any, predicate?: any) {
    return this.connect(form, predicate, formFieldValue).pipe(
      tap((it) => {
        console.log(it);
      })
    );
  }

  // controlUseManyField(form, formValue) {
  //   // form.dependOn(this, formValue);
  // }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  render() {
    this.visible = true;
    // this.mainForm.renderedFormField.push()
    this.mainForm.renderedShadowForms.add(this);
    const fields = this.mainForm._resolveFormField();
    // this.mainForm.__tempFields.next(fields);
  }
}

