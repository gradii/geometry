/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  OnInit
} from '@angular/core';

/**
 * @title button-type
 */
@Component({
  selector: 'tri-demo-button-type',
  template: `
    <button tri-button [type]="'primary'">
      <span>Primary</span>
    </button>
    <button tri-button [type]="'default'">
      <span>Default</span>
    </button>
    <button tri-button [type]="'dashed'">
      <span>Dashed</span>
    </button>
    <button tri-button [type]="'danger'">
      <span>Danger</span>
    </button>
    <a triButton href="//google.com">
      Link Button
    </a>

    <h5>raised button</h5>
    <button triRaisedButton color="primary">
      primary button
    </button>
    <button triRaisedButton color="secondary">
      secondary button
    </button>
    <button triRaisedButton color="success">
      success button
    </button>
    <button triRaisedButton color="info">
      info button
    </button>
    <button triRaisedButton color="warning">
      warning button
    </button>
    <button triRaisedButton color="danger">
      danger button
    </button>


    <h5>rounded button</h5>
    <button triRoundedButton color="primary">
      rounded button
    </button>

    <h5>text button</h5>
    <button triTextButton color="primary">
      primary text button
    </button>
    <button triTextButton color="secondary">
      secondary text button
    </button>
    <button triTextButton color="success">
      success text button
    </button>
    <button triTextButton color="info">
      info text button
    </button>
    <button triTextButton color="warning">
      warning text button
    </button>
    <button triTextButton color="danger">
      danger text button
    </button>

    <h5>outlined button</h5>
    <button triOutlinedButton color="primary">
      primary outlined button
    </button>
    <button triOutlinedButton color="secondary">
      secondary outlined button
    </button>
    <button triOutlinedButton color="success">
      success outlined button
    </button>
    <button triOutlinedButton color="info">
      info outlined button
    </button>
    <button triOutlinedButton color="warning">
      warning outlined button
    </button>
    <button triOutlinedButton color="danger">
      danger outlined button
    </button>
  `,
  styles  : []
})
export class TriDemoButtonTypeComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }
}
