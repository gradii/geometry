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
  selector : 'tri-ng-tree',
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
  @Input('tree') public treeModel: TreeModel;
  /* tslint:enable:no-input-rename */

  @Input() public settings: Ng2TreeSettings;

  @Output() public nodeCreated: EventEmitter<any> = new EventEmitter();

  @Output() public nodeRemoved: EventEmitter<any> = new EventEmitter();

  @Output() public nodeRenamed: EventEmitter<any> = new EventEmitter();

  @Output() public nodeSelected: EventEmitter<any> = new EventEmitter();

  @Output() public nodeUnselected: EventEmitter<any> = new EventEmitter();

  @Output() public nodeMoved: EventEmitter<any> = new EventEmitter();

  @Output() public nodeExpanded: EventEmitter<any> = new EventEmitter();

  @Output() public nodeCollapsed: EventEmitter<any> = new EventEmitter();

  @Output() public loadNextLevel: EventEmitter<any> = new EventEmitter();

  @Output() public nodeChecked: EventEmitter<NodeCheckedEvent> = new EventEmitter();

  @Output() public nodeUnchecked: EventEmitter<NodeUncheckedEvent> = new EventEmitter();

  @Output() public menuItemSelected: EventEmitter<any> = new EventEmitter();

  public tree: Tree;

  @ViewChild('rootComponent', {static: true})
  public rootComponent: TreeInternalComponent;

  @ContentChild(TreeRenderTemplateDirective, {read: TreeRenderTemplateDirective, static: false})
  public renderTemplate: TreeRenderTemplateDirective;

  @ContentChild(TreeCommandTemplateDirective, {read: TreeCommandTemplateDirective, static: false})
  public commandTemplate: TreeCommandTemplateDirective;

  private subscriptions: Subscription[] = [];

  public constructor(@Inject(TreeService) private treeService: TreeService) {}

  public ngOnChanges(changes: SimpleChanges): void {
    if (!this.treeModel) {
      this.tree = TreeComponent.EMPTY_TREE;
    } else {
      this.tree = new Tree(this.treeModel);
    }
  }

  public ngOnInit(): void {

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

  public getController(): TreeController {
    return this.rootComponent.controller;
  }

  public getControllerByNodeId(id: number | string): TreeController {
    return this.treeService.getController(id);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub && sub.unsubscribe());
  }
}
