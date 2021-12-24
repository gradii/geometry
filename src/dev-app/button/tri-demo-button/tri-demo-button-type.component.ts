/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Component, OnInit } from '@angular/core';

/**
 * @title button-type
 */
@Component({
  selector: 'tri-demo-button-type',
  template: `
    <h5>default fill button</h5>
    <div>
      <button tri-button [color]="'default'">
        <span>Default</span>
      </button>
      <button tri-button [color]="'primary'">
        <span>Primary</span>
      </button>
      <button tri-button color="secondary">
        secondary button
      </button>
      <button tri-button [color]="'error'">
        <span>Danger</span>
      </button>
      <a triButton href="//google.com">
        Link Button
      </a>
      <a triTextButton href="//google.com">
        Link Button
      </a>
    </div>

    <h5>raised button</h5>
    <button triRaisedButton color="default">
      primary button
    </button>
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
    <button triRaisedButton color="error">
      error button
    </button>


    <h5>rounded button</h5>
    <button triRoundedButton color="primary">
      rounded button
    </button>
    <button triRoundedButton color="secondary">
      secondary button
    </button>
    <button triRoundedButton color="success">
      success button
    </button>
    <button triRoundedButton color="info">
      info button
    </button>
    <button triRoundedButton color="warning">
      warning button
    </button>
    <button triRoundedButton color="error">
      error button
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
    <button triTextButton color="error">
      error text button
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
    <button triOutlinedButton color="error">
      error outlined button
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
