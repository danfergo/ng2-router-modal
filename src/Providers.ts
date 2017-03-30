import {Provider, Type} from "@angular/core";
import {ResourceModal} from "./Modal";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RmService} from "./RouterModalService";

export class Providers {
    private static providers: Provider[] = [];


    static addProvider(modal: Type<ResourceModal>) {
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