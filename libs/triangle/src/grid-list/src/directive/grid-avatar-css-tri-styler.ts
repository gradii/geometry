import { Directive } from '@angular/core';

@Directive({
  selector: '[tri-grid-avatar], [triGridAvatar]',
  host    : {class: 'ant-grid-avatar'}
})
export class GridAvatarCssTriStyler {}
