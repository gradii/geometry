import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TreeSelectComponent } from "./tree-select.component";

@NgModule({
    imports: [
        CommonModule,
    ],
    declarations: [
        TreeSelectComponent,
    ],
    exports: [
        TreeSelectComponent,
    ]
})
export class TriTreeSelectModule {

}