import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StepsComponent } from './steps.component';
import { StepComponent } from './step.component';
import { StepConnectService } from './step-connect.service';

@NgModule({
  imports: [CommonModule],
  exports: [StepsComponent, StepComponent],
  declarations: [StepsComponent, StepComponent],
  providers: [StepConnectService]
})
export class TriStepsModule {}
