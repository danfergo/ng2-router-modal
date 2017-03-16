import {Provider, Type, Injector} from "@angular/core";
import {ResourceModal} from "./Modal";
import {NgbModal, NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {EventModalComponent} from "../../modals/event-modal/event-modal.component";
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