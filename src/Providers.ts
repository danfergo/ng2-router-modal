import {Provider, Type} from "@angular/core";
import {RmModal} from "./RmModal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RmService} from "./RmService";

export class Providers {
    private static providers: Provider[] = [];


    static addProvider(modal: Type<RmModal>) {
        this.providers.push({
            provide: modal,
            useFactory: (...args: any[]) => new modal(...args),
            deps: [NgbModal]
        });
    }


    static get(): Provider[]{
        return this.providers.concat([RmService]);
    }
}