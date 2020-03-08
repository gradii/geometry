/**
 * @license
 * Copyright LinboLen Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { merge, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { NodeDraggableEvent } from './draggable/draggable.events';
import { NodeEditableEvent, NodeEditableEventAction } from './editable/editable.events';
import { NodeMenuItemAction, NodeMenuItemSelectedEvent } from './menu/menu.events';
import { NodeMenuService } from './menu/node-menu.service';
import { Tree } from './tree';
import { TreeController } from './tree-controller';
import { NodeCheckedEvent, NodeEvent } from './tree.events';
import { TreeService } from './tree.service';

import { Ng2TreeSettings } from './tree.types';
import { isLeftButtonClicked, isRightButtonClicked } from './utils/event.utils';
import { get, isNil } from './utils/fn.utils';

@Component({
  selector: 'tree-internal',
  template: `
    <ul class="tree" *ngIf="tree" [ngClass]="{rootless: isRootHidden()}">
      <li>
        <div class="value-container"
             [ngClass]="{rootless: isRootHidden()}"
             [class.selected]="isSelected"
             (click)="onNodeSelected($event)"
             (contextmenu)="showRightMenu($event)"
             [nodeDraggable]="nodeElementRef"
             [tree]="tree">

          <div class="folding" (click)="$event.stopPropagation();onSwitchFoldingType()" [ngClass]="tree.foldingCssClass"></div>

          <div class="node-checkbox" *ngIf="settings.showCheckboxes">
            <input checkbox type="checkbox" [disabled]="isReadOnly" [checked]="this.tree.checked" (change)="switchNodeCheckStatus()" #checkbox/>
          </div>

          <div class="node-value"
               *ngIf="!shouldShowInputForTreeValue()"
               [class.node-selected]="isSelected">
            <div *ngIf="tree.nodeTemplate" class="node-template" [innerHTML]="tree.nodeTemplate | safeHtml"></div>
            <span *ngIf="!renderTemplate" class="node-name" [innerHTML]="tree.value | safeHtml"></span>
            <span class="loading-children" *ngIf="tree.childrenAreBeingLoaded()"></span>
            <ng-template [ngTemplateOutlet]="renderTemplate" [ngTemplateOutletContext]="{ $implicit: tree.node }"></ng-template>
          </div>

          <div class="node-command">
            <ng-template [ngTemplateOutlet]="commandTemplate" [ngTemplateOutletContext]="{ $implicit: tree.node, tree: tree }"></ng-template>
          </div>

          <input type="text" class="node-value"
                 *ngIf="shouldShowInputForTreeValue()"
                 [nodeEditable]="tree.value"
                 (valueChanged)="applyNewValue($event)"/>

          <div class="node-left-menu" *ngIf="tree.hasLeftMenu()" (click)="showLeftMenu($event)" [innerHTML]="tree.leftMenuTemplate">
          </div>
          <node-menu *ngIf="tree.hasLeftMenu() && isLeftMenuVisible && !hasCustomMenu()"
                     (menuItemSelected)="onMenuItemSelected($event)">
          </node-menu>
        </div>

        <node-menu *ngIf="isRightMenuVisible && !hasCustomMenu()"
                   (menuItemSelected)="onMenuItemSelected($event)">
        </node-menu>

        <node-menu *ngIf="hasCustomMenu() && (isRightMenuVisible || isLeftMenuVisible)"
                   [menuItems]="tree.menuItems"
                   (menuItemSelected)="onMenuItemSelected($event)">
        </node-menu>
        <ng-template [ngIf]="tree.isNodeExpanded()">
          <tree-internal *ngFor="let child of tree.childrenAsync | async" [tree]="child" [renderTemplate]="renderTemplate" [commandTemplate]="commandTemplate" [settings]="settings"></tree-internal>
        </ng-template>
      </li>
    </ul>
  `
})
export class TreeInternalComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() tree: Tree;

  @Input() settings: Ng2TreeSettings;

  @Input() renderTemplate: TemplateRef<any>;

  @Input() commandTemplate: TemplateRef<any>;

  isSelected = false;
  isRightMenuVisible = false;
  isLeftMenuVisible = false;
  isReadOnly = false;
  controller: TreeController;

  @ViewChild('checkbox', {static: false}) checkboxElementRef: ElementRef;

  private subscriptions: Subscription[] = [];

  constructor(private nodeMenuService: NodeMenuService,
                     public treeService: TreeService,
                     public nodeElementRef: ElementRef) {}

  ngAfterViewInit(): void {
    if (this.tree.checked && !(this.tree as any).firstCheckedFired) {
      (this.tree as any).firstCheckedFired = true;
      this.treeService.fireNodeChecked(this.tree);
    }
  }

  ngOnInit(): void {
    const nodeId = get(this.tree, 'node.id', '');
    if (nodeId) {
      this.controller = new TreeController(this);
      this.treeService.setController(nodeId, this.controller);
    }

    this.settings = this.settings || new Ng2TreeSettings();
    this.isReadOnly = !get(this.settings, 'enableCheckboxes', true);

    if (this.tree.isRoot() && this.settings.rootIsVisible === false) {
      this.tree.disableCollapseOnInit();
    }

    this.subscriptions.push(
      this.nodeMenuService.hideMenuStream(this.nodeElementRef).subscribe(() => {
        this.isRightMenuVisible = false;
        this.isLeftMenuVisible = false;
      })
    );

    this.subscriptions.push(this.treeService.unselectStream(this.tree).subscribe(() => (this.isSelected = false)));

    this.subscriptions.push(
      this.treeService.draggedStream(this.tree, this.nodeElementRef).subscribe((e: NodeDraggableEvent) => {
        if (this.tree.hasSibling(e.captured.tree)) {
          this.swapWithSibling(e.captured.tree, this.tree);
        } else if (this.tree.isBranch()) {
          this.moveNodeToThisTreeAndRemoveFromPreviousOne(e, this.tree);
        } else {
          this.moveNodeToParentTreeAndRemoveFromPreviousOne(e, this.tree);
        }
      })
    );

    this.subscriptions.push(
      merge(
        this.treeService.nodeChecked$,
        this.treeService.nodeUnchecked$
      ).pipe(
        filter((e: NodeCheckedEvent) => this.eventContainsId(e) && this.tree.hasChild(e.node))
      ).subscribe((e: NodeCheckedEvent) => this.updateCheckboxState())
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.controller = new TreeController(this);
  }

  ngOnDestroy(): void {
    if (get(this.tree, 'node.id', '')) {
      this.treeService.deleteController(this.tree.node.id);
    }

    this.subscriptions.forEach(sub => sub && sub.unsubscribe());
  }

  onNodeSelected(e: { button: number }): void {
    if (!this.tree.selectionAllowed) {
      return;
    }

    if (isLeftButtonClicked(e as MouseEvent)) {
      this.isSelected = true;
      this.treeService.fireNodeSelected(this.tree);
    }
  }

  onNodeUnselected(e: { button: number }): void {
    if (!this.tree.selectionAllowed) {
      return;
    }

    if (isLeftButtonClicked(e as MouseEvent)) {
      this.isSelected = false;
      this.treeService.fireNodeUnselected(this.tree);
    }
  }

  showRightMenu(e: MouseEvent): void {
    if (!this.tree.hasRightMenu()) {
      return;
    }

    if (isRightButtonClicked(e)) {
      this.isRightMenuVisible = !this.isRightMenuVisible;
      this.nodeMenuService.hideMenuForAllNodesExcept(this.nodeElementRef);
    }
    e.preventDefault();
  }

  showLeftMenu(e: MouseEvent): void {
    if (!this.tree.hasLeftMenu()) {
      return;
    }

    if (isLeftButtonClicked(e)) {
      this.isLeftMenuVisible = !this.isLeftMenuVisible;
      this.nodeMenuService.hideMenuForAllNodesExcept(this.nodeElementRef);
      if (this.isLeftMenuVisible) {
        e.preventDefault();
      }
    }
  }

  onMenuItemSelected(e: NodeMenuItemSelectedEvent): void {
    switch (e.nodeMenuItemAction) {
      case NodeMenuItemAction.NewTag:
        this.onNewSelected(e);
        break;
      case NodeMenuItemAction.NewFolder:
        this.onNewSelected(e);
        break;
      case NodeMenuItemAction.Rename:
        this.onRenameSelected();
        break;
      case NodeMenuItemAction.Remove:
        this.onRemoveSelected();
        break;
      case NodeMenuItemAction.Custom:
        this.onCustomSelected();
        this.treeService.fireMenuItemSelected(this.tree, e.nodeMenuItemSelected);
        break;
      default:
        throw new Error(`Chosen menu item doesn't exist`);
    }
  }

  onSwitchFoldingType(): void {
    this.tree.switchFoldingType();
    this.treeService.fireNodeSwitchFoldingType(this.tree);
  }

  applyNewValue(e: NodeEditableEvent): void {
    if ((e.action === NodeEditableEventAction.Cancel || this.tree.isNew()) && Tree.isValueEmpty(e.value)) {
      return this.treeService.fireNodeRemoved(this.tree);
    }

    if (this.tree.isNew()) {
      this.tree.value = e.value;
      this.treeService.fireNodeCreated(this.tree);
    }

    if (this.tree.isBeingRenamed()) {
      const oldValue = this.tree.value;
      this.tree.value = e.value;
      this.treeService.fireNodeRenamed(oldValue, this.tree);
    }

    this.tree.markAsModified();
  }

  shouldShowInputForTreeValue(): boolean {
    return this.tree.isNew() || this.tree.isBeingRenamed();
  }

  isRootHidden(): boolean {
    return this.tree.isRoot() && !this.settings.rootIsVisible;
  }

  hasCustomMenu(): boolean {
    return this.tree.hasCustomMenu();
  }

  switchNodeCheckStatus() {
    if (!this.tree.checked) {
      this.onNodeChecked();
    } else {
      this.onNodeUnchecked();
    }
  }

  onNodeChecked(): void {
    if (!this.checkboxElementRef) {
      return;
    }

    this.checkboxElementRef.nativeElement.indeterminate = false;
    this.treeService.fireNodeChecked(this.tree);
    this.executeOnChildController(controller => controller.check());
    this.tree.checked = true;
  }

  onNodeUnchecked(): void {
    if (!this.checkboxElementRef) {
      return;
    }

    this.checkboxElementRef.nativeElement.indeterminate = false;
    this.treeService.fireNodeUnchecked(this.tree);
    this.executeOnChildController(controller => controller.uncheck());
    this.tree.checked = false;
  }

  updateCheckboxState(): void {
    // Calling setTimeout so the value of isChecked will be updated and after that I'll check the children status.
    setTimeout(() => {
      const checkedChildrenAmount = this.tree.checkedChildrenAmount();
      if (checkedChildrenAmount === 0) {
        this.checkboxElementRef.nativeElement.indeterminate = false;
        this.tree.checked = false;
        this.treeService.fireNodeUnchecked(this.tree);
      } else if (checkedChildrenAmount === this.tree.loadedChildrenAmount()) {
        this.checkboxElementRef.nativeElement.indeterminate = false;
        this.tree.checked = true;
        this.treeService.fireNodeChecked(this.tree);
      } else {
        this.tree.checked = false;
        this.checkboxElementRef.nativeElement.indeterminate = true;
        this.treeService.fireNodeIndetermined(this.tree);
      }
    });
  }

  private swapWithSibling(sibling: Tree, tree: Tree): void {
    tree.swapWithSibling(sibling);
    this.treeService.fireNodeMoved(sibling, sibling.parent);
  }

  private moveNodeToThisTreeAndRemoveFromPreviousOne(e: NodeDraggableEvent, tree: Tree): void {
    this.treeService.fireNodeRemoved(e.captured.tree);
    const addedChild = tree.addChild(e.captured.tree);
    this.treeService.fireNodeMoved(addedChild, e.captured.tree.parent);
  }

  private moveNodeToParentTreeAndRemoveFromPreviousOne(e: NodeDraggableEvent, tree: Tree): void {
    this.treeService.fireNodeRemoved(e.captured.tree);
    const addedSibling = tree.addSibling(e.captured.tree, tree.positionInParent);
    this.treeService.fireNodeMoved(addedSibling, e.captured.tree.parent);
  }

  private onNewSelected(e: NodeMenuItemSelectedEvent): void {
    this.tree.createNode(e.nodeMenuItemAction === NodeMenuItemAction.NewFolder);
    this.isRightMenuVisible = false;
    this.isLeftMenuVisible = false;
  }

  private onRenameSelected(): void {
    this.tree.markAsBeingRenamed();
    this.isRightMenuVisible = false;
    this.isLeftMenuVisible = false;
  }

  private onRemoveSelected(): void {
    this.treeService.deleteController(get(this.tree, 'node.id', ''));
    this.treeService.fireNodeRemoved(this.tree);
  }

  private onCustomSelected(): void {
    this.isRightMenuVisible = false;
    this.isLeftMenuVisible = false;
  }

  private executeOnChildController(executor: (controller: TreeController) => void) {
    if (this.tree.hasLoadedChildern()) {
      this.tree.children.forEach((child: Tree) => {
        const controller = this.treeService.getController(child.id);
        if (!isNil(controller)) {
          executor(controller);
        }
      });
    }
  }

  private eventContainsId(event: NodeEvent): boolean {
    if (!event.node.id) {
      console.warn(
        '"Node with checkbox" feature requires a unique id assigned to every node, please consider to add it.'
      );
      return false;
    }
    return true;
  }
}