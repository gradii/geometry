import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'apsaradb-basic',
  templateUrl: './basic.component.html',
  styleUrls  : ['./basic.component.scss']
})
export class BasicComponent implements OnInit {

  list = [
    {name: "foo1", age: "13", height: "145cm"},
    {name: "foo2", age: "14", height: "155cm"},
  ];

  constructor() { }

  ngOnInit() {
  }

}
