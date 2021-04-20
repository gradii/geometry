/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import {
  Directive,
  Host,
  Input,
  TemplateRef
} from '@angular/core';


/**
 * Content of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: '[triCardBody]',
})
export class TriCardBody {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Title of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `[triCardTitle]`,
})
export class TriCardTitle {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

@Directive({
  selector: `[triCardTitleExtra]`,
})
export class TriCardTitleExtra {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Sub-title of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: `[triCardSubtitle]`,
})
export class TriCardSubtitle {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Action section of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'tri-card-actions',
  // host    : {
  //   'class'                             : 'tri-card-actions',
  //   '[class.tri-card-actions-align-end]': 'align === "end"',
  // }
})
export class TriCardActions {
  /** Position of the actions inside the card. */
  // @Input() align: 'start' | 'end' = 'start';
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Footer of a card, needed as it's used as a selector in the API.
 */
@Directive({
  selector: 'tri-card-footer',
})
export class TriCardFooter {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardImage]',
  host    : {'class': 'tri-card-image'}
})
export class TriCardImage {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardImageSmall]',
  host    : {'class': 'tri-card-sm-image'}
})
export class TriCardSmImage {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardImageMedium]',
})
export class TriCardMdImage {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardImageLarge]',
})
export class TriCardLgImage {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Large image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardImageXLarge]',
})
export class TriCardXlImage {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

/**
 * Avatar image used in a card, needed to add the tri- CSS styling.
 */
@Directive({
  selector: '[triCardAvatar]',
})
export class TriCardAvatar {
  constructor(@Host() templateRef: TemplateRef<any>) {
  }
}

