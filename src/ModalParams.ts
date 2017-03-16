import {Type} from "@angular/core";
import {ResourceModal} from "./Modal";
import {IModalParams} from "./Interfaces";
import {Providers} from "./Providers";

export function ModalParams(params: IModalParams) {

    return function (target: Type<ResourceModal>) {
        target.prototype.name = params.name;
        target.prototype.actions = params.actions;
        target.prototype.component = params.component;
        Providers.addProvider(target);
    }
}
