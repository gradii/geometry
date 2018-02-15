import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StepConnectService } from './step-connect.service';
import { StepComponent } from './step.component';

import { StepsComponent } from './steps.component';

@NgModule({
  imports     : [CommonModule],
  exports     : [StepsComponent, StepComponent],
  declarations: [StepsComponent, StepComponent],
  providers   : [StepConnectService]
})
export class TriStepsModule {}
