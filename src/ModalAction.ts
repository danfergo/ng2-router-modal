import {IModalAction} from "./Interfaces";
import {ResourceModal} from "./Modal";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

export function ModalAction(methodOptions?: IModalAction) {

    return function (target: ResourceModal, propertyKey: string) {

        // (<any>target).data =  methodOptions.data ||  {};
        //
        (<any>target)[propertyKey] = function (...args: any[]): NgbModalRef {
            return this.open();
        }
    }
}