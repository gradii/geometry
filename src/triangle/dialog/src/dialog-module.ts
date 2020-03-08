import { A11yModule } from '@angular/cdk/a11y';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TriDialog } from './dialog';
import { TriDialogContainer } from './dialog-container';
import { TRI_DIALOG_SCROLL_STRATEGY_PROVIDER } from './dialog-injectors';
import { DummyDialog } from './dummy-dialog/dummy-dialog';
import { TriDialogActions } from './helper/dialog-actions';
import { TriDialogClose, } from './helper/dialog-close';
import { TriDialogContent } from './helper/dialog-content';
import { TriDialogHeader } from './helper/dialog-header';

@NgModule({
  imports        : [
    CommonModule,
    OverlayModule,
    PortalModule,
    A11yModule,
  ],
  exports        : [
    TriDialogContainer,
    TriDialogClose,
    TriDialogHeader,
    TriDialogActions,
    TriDialogContent,
  ],
  declarations   : [
    TriDialogContainer,
    TriDialogClose,
    TriDialogHeader,
    TriDialogActions,
    TriDialogContent,

    DummyDialog
  ],
  providers      : [
    TriDialog,
    TRI_DIALOG_SCROLL_STRATEGY_PROVIDER,
  ],
})
export class TriDialogModule {}
