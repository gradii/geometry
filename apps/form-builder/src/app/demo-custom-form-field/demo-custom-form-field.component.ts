import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'paorform-demo-custom-form-field',
  templateUrl: './demo-custom-form-field.component.html',
  styleUrls: ['./demo-custom-form-field.component.scss']
})
export class DemoCustomFormFieldComponent implements OnInit {
  form = {
    name: new FormControl()
  };

  formGroup = new FormGroup({
    'name': new FormControl()
  });

  ngOnInit(): void {
  }

}
