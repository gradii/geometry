import { Directive } from '@angular/core';

@Directive({
  selector: '[tri-grid-avatar], [triGridAvatar]',
  host    : {class: 'tri-grid-avatar'}
})
export class GridAvatarCssTriStyler {}
