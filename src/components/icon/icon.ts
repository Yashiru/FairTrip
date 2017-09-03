import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-icon',
    templateUrl: 'icon.html'
})

export class Icon {

    @Input()
    selectedIcon: string;

    @Input()
    isColored: Boolean;

    constructor() { }

}