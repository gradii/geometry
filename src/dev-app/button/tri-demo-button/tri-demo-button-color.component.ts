import { Component } from "@angular/core";

@Component({
    selector: 'tri-demo-button-color',
    template: `
    <h5>primary<h5>
    <div>
        <button triButton color="primary">primary color</button>
        
    </div>
    `
})
export class TriDemoButtonColorComponent {
    constructor(){

    }
}