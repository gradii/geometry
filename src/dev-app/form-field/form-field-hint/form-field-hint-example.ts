/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component } from '@angular/core';

/** @title Form field with hints */
@Component({
  selector   : 'form-field-hint-example',
  templateUrl: 'form-field-hint-example.html',
  styleUrls  : ['form-field-hint-example.css'],
})
export class FormFieldHintExample {

  placeholder: string = 'Ex. Nougat';
}
