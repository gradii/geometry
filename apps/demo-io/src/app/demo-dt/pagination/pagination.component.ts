import { Component, OnInit } from '@angular/core';

@Component({
  selector   : 'apsaradb-pagination',
  templateUrl: './pagination.component.html',
  styleUrls  : ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  list = [
    {name: "foo1", age: "13", height: "145cm"},
    {name: "foo2", age: "14", height: "155cm"},
  ];

  constructor() { }

  ngOnInit() {
  }

}
