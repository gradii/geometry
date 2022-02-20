import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreviewDefinitionComponent } from './preview-definition/preview-definition.component';
import { PreviewComponent } from './preview/preview.component';

const routes: Routes = [
  { path: '', redirectTo: 'preview', pathMatch: 'full' },
  { path: 'preview', component: PreviewComponent },
  { path: 'preview-definition', component: PreviewDefinitionComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
