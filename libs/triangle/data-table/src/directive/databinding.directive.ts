import { process, State } from '@gradii/triangle/data-query';
import { isPresent } from '@gradii/triangle/util';
import { Directive, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { DataTableComponent } from '../data-table.component';
import { anyChanged } from '../utils';

@Directive({
  selector: '[triGridBinding], [tri-grid-binding]'
})
export class DataBindingDirective implements OnInit, OnDestroy, OnChanges {
  protected state: State;
  protected originalData;
  private stateChangeSubscription;

  constructor(protected grid: DataTableComponent) {
    this.state = {
      skip: 0
    };
    this.originalData = [];
  }

  @Input()
  set skip(value) {
    if (!isPresent(value)) {
      value = 0;
    }
    this.grid.skip = this.state.skip = value;
  }

  @Input()
  set sort(value) {
    this.grid.sort = this.state.sort = value;
  }

  @Input()
  set filter(value) {
    this.grid.filter = this.state.filter = value;
  }

  @Input()
  set take(value) {
    this.grid.take = this.state.take = value;
  }

  @Input()
  set group(value) {
    this.grid.group = this.state.group = value;
  }

  @Input('triGridBinding')
  set data(value) {
    this.originalData = value || [];
    this.grid.data = this.process(this.state);
  }

  ngOnInit() {
    this.applyState(this.state);
    this.stateChangeSubscription = this.grid.dataStateChange.subscribe(this.onStateChange.bind(this));
  }

  ngOnDestroy() {
    this.stateChangeSubscription.unsubscribe();
  }

  ngOnChanges(changes) {
    if (anyChanged(['take', 'skip', 'sort', 'group', 'filter'], changes)) {
      this.rebind();
    }
  }

  onStateChange(state) {
    this.applyState(state);
    this.rebind();
  }

  rebind() {
    this.data = this.originalData;
    this.grid.onDataChange();
  }

  process(state) {
    return process(this.originalData, state);
  }

  applyState({skip, take, sort, group, filter}: { skip?; take?; sort?; group?; filter? }) {
    this.skip = skip;
    this.take = take;
    this.sort = sort;
    this.group = group;
    this.filter = filter;
  }
}
