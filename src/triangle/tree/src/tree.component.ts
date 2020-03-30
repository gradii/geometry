/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Component,
  ContentChild,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';

import { Tree } from './tree';
import { TreeCommandTemplateDirective } from './tree-command-template.directive';
import { TreeController } from './tree-controller';
import { TreeInternalComponent } from './tree-internal.component';
import { TreeRenderTemplateDirective } from './tree-render-template.directive';
import {
  LoadNextLevelEvent,
  MenuItemSelectedEvent,
  NodeCheckedEvent,
  NodeCollapsedEvent,
  NodeCreatedEvent,
  NodeExpandedEvent,
  NodeMovedEvent,
  NodeRemovedEvent,
  NodeRenamedEvent,
  NodeSelectedEvent,
  NodeUncheckedEvent,
  NodeUnselectedEvent,
} from './tree.events';
import { TreeService } from './tree.service';
import { Ng2TreeSettings, TreeModel } from './tree.types';

@Component({
  selector : 'tri-tree',
  template : `
      <tree-internal #rootComponent
                     [tree]="tree"
                     [settings]="settings"
                     [renderTemplate]="renderTemplate?.templateRef"
                     [commandTemplate]="commandTemplate?.templateRef"></tree-internal>`,
  providers: [TreeService]
})
export class TreeComponent implements OnInit, OnChanges, OnDestroy {
  private static EMPTY_TREE: Tree = new Tree({value: ''});

  /* tslint:disable:no-input-rename */
  @Input('tree') treeModel: TreeModel;
  /* tslint:enable:no-input-rename */

  @Input() settings: Ng2TreeSettings;

  @Output() nodeCreated: EventEmitter<any> = new EventEmitter();

  @Output() nodeRemoved: EventEmitter<any> = new EventEmitter();

  @Output() nodeRenamed: EventEmitter<any> = new EventEmitter();

  @Output() nodeSelected: EventEmitter<any> = new EventEmitter();

  @Output() nodeUnselected: EventEmitter<any> = new EventEmitter();

  @Output() nodeMoved: EventEmitter<any> = new EventEmitter();

  @Output() nodeExpanded: EventEmitter<any> = new EventEmitter();

  @Output() nodeCollapsed: EventEmitter<any> = new EventEmitter();

  @Output() loadNextLevel: EventEmitter<any> = new EventEmitter();

  @Output() nodeChecked: EventEmitter<NodeCheckedEvent> = new EventEmitter();

  @Output() nodeUnchecked: EventEmitter<NodeUncheckedEvent> = new EventEmitter();

  @Output() menuItemSelected: EventEmitter<any> = new EventEmitter();

  tree: Tree;

  @ViewChild('rootComponent', {static: true})
  rootComponent: TreeInternalComponent;

  @ContentChild(TreeRenderTemplateDirective, {read: TreeRenderTemplateDirective, static: false})
  renderTemplate: TreeRenderTemplateDirective;

  @ContentChild(TreeCommandTemplateDirective, {read: TreeCommandTemplateDirective, static: false})
  commandTemplate: TreeCommandTemplateDirective;

  private subscriptions: Subscription[] = [];

  constructor(@Inject(TreeService) private treeService: TreeService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.treeModel) {
      this.tree = TreeComponent.EMPTY_TREE;
    } else {
      this.tree = new Tree(this.treeModel);
    }
  }

  ngOnInit(): void {

    this.subscriptions.push(
      this.treeService.nodeRemoved$.subscribe((e: NodeRemovedEvent) => {
        this.nodeRemoved.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeRenamed$.subscribe((e: NodeRenamedEvent) => {
        this.nodeRenamed.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeCreated$.subscribe((e: NodeCreatedEvent) => {
        this.nodeCreated.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeSelected$.subscribe((e: NodeSelectedEvent) => {
        this.nodeSelected.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeUnselected$.subscribe((e: NodeUnselectedEvent) => {
        this.nodeUnselected.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeMoved$.subscribe((e: NodeMovedEvent) => {
        this.nodeMoved.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeExpanded$.subscribe((e: NodeExpandedEvent) => {
        this.nodeExpanded.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeCollapsed$.subscribe((e: NodeCollapsedEvent) => {
        this.nodeCollapsed.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.menuItemSelected$.subscribe((e: MenuItemSelectedEvent) => {
        this.menuItemSelected.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.loadNextLevel$.subscribe((e: LoadNextLevelEvent) => {
        this.loadNextLevel.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeChecked$.subscribe((e: NodeCheckedEvent) => {
        this.nodeChecked.emit(e);
      })
    );

    this.subscriptions.push(
      this.treeService.nodeUnchecked$.subscribe((e: NodeUncheckedEvent) => {
        this.nodeUnchecked.emit(e);
      })
    );
  }

  getController(): TreeController {
    return this.rootComponent.controller;
  }

  getControllerByNodeId(id: number | string): TreeController {
    return this.treeService.getController(id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub && sub.unsubscribe());
  }
}
