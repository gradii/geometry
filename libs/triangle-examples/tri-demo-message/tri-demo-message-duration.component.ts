import { Component, OnInit } from '@angular/core';
import { MessageService } from '@gradii/triangle/message';

/**
 * @title message-duration
 */
@Component({
  selector: 'tri-demo-message-duration',
  template: `
              <button tri-button [type]="'default'" (click)="createBasicMessage()">自定义时长提示</button>
            `,
  styles: []
})
export class TriDemoMessageDurationComponent implements OnInit {
  createBasicMessage = () => {
    this._message.success('这是一条成功的提示,并将于10秒后消失', { duration: 10000 });
  };

  constructor(private _message: MessageService) {}

  ngOnInit() {}
}
