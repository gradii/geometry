import { Observable } from 'rxjs';

export interface INode {

}

export type BindableBoolean = boolean | string | Observable<boolean> | Promise<boolean>;

export interface IDomStyleNode {
  visible: boolean;
  direction: string | 'column' | 'row';
  justify: string | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  align: string | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  height: {
    type: string,
    customValue: number | string,
    customUnit: string
  };
  margins: {
    marginTop: number
    marginRight: number
    marginBottom: number
    marginLeft: number
    marginTopUnit: string
    marginRightUnit: string
    marginBottomUnit: string
    marginLeftUnit: string
  };
  paddings: {
    paddingTop: number
    paddingRight: number
    paddingBottom: number
    paddingLeft: number
    paddingTopUnit: string
    paddingRightUnit: string
    paddingBottomUnit: string
    paddingLeftUnit: string
  };
  overflowX: string | 'auto' | 'scroll' | 'hidden';
  overflowY: string | 'auto' | 'scroll' | 'hidden';
  width: {
    type: string | 'auto' | 'custom'
    customValue: number | string
    customUnit: string
  };
  background: {
    color: string,
    imageSrc: {
      url: string
      uploadUrl: string
      name: string
      active: string
    },
    imageSize: string
  };
}

export interface IStyleNode {
  styles: {
    xl: IDomStyleNode
    lg: IDomStyleNode
    md: IDomStyleNode
    sm: IDomStyleNode
    xs: IDomStyleNode
  };
}

export class PageNode {
  id: string;
  title: string;
  url: string;
  pageList: any[];
  contentSlot?: INode;

  readonly slots: any[];
}

export class StyleNode {
  styles: {
    xl: IDomStyleNode
    lg: IDomStyleNode
    md: IDomStyleNode
    sm: IDomStyleNode
    xs: IDomStyleNode
  };
}

export class CardNode {
  styles: StyleNode;
  name: string;
  showHeader: boolean;
  showFooter: boolean;
  container: boolean;

  // action
  init?: any;
  click?: any;

  headerSlot: INode;
  contentSlot: INode;
  containerSlot: INode;
}

export class AccordionNode {
  styles: StyleNode;
  name: string;
  showHeader: boolean;
  showFooter: boolean;
  container: boolean;

  // action
  init?: any;
  click?: any;
  slots: any[];
}

export class ListNode {
  name: string;
}

export class ListItemNode {

}

