import {Type} from "@angular/core";
import {RmModal} from "./RmModal";
import {IModalParams} from "./Interfaces";
import {Providers} from "./Providers";

export function ModalParams(params: IModalParams) {

    return function (target: Type<RmModal>) {
        target.prototype.name = params.name;
        target.prototype.component = params.component;
        Providers.addProvider(target);
    }
}
