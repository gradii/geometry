import {
    Directive,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';

import { Subscription } from 'rxjs';

import { DragAndDropService } from './drag-and-drop.service';
import { DragAndDropContext } from './context-types';
import { filter } from 'rxjs/operators';

/**
 * @hidden
 */
@Directive({
    selector: '[triDropTarget]'
})
export class DropTargetDirective implements OnInit, OnDestroy {
    @Input() public context: DragAndDropContext = <DragAndDropContext>{};

    @Output() public enter: EventEmitter<any> = new EventEmitter<any>();
    @Output() public leave: EventEmitter<any> = new EventEmitter<any>();
    @Output() public drop: EventEmitter<any> = new EventEmitter<any>();

    private subscriptions: Subscription = new Subscription();

    constructor(
        public element: ElementRef,
        private service: DragAndDropService
    ) { }

    public ngOnInit(): void {
        this.service.add(this);

        const changes = this.service.changes.pipe(filter(({ target }) => target === this));

        this.subscriptions.add(
            changes.pipe(filter(({ type }) => type === 'leave'))
                .subscribe(e => {
                    this.leave.next(this.eventArgs(e));
                })
        );

        this.subscriptions.add(
            changes.pipe(filter(({ type }) => type === 'enter'))
                .subscribe(e => {
                    this.enter.next(this.eventArgs(e));
                })
        );

        this.subscriptions.add(
            changes.pipe(filter(({ type }) => type === 'drop'))
                .subscribe(e => {
                    this.drop.next(this.eventArgs(e));
                })
        );
    }

    public ngOnDestroy(): void {
        if (this.subscriptions) {
            this.subscriptions.unsubscribe();
        }
    }

    private eventArgs(e: any): Object {
        return {
            target: this,
            mouseEvent: e.mouseEvent,
            draggable: e.draggable
        };
    }
}
