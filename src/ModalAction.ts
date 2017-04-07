import {IModalAction} from "./Interfaces";
import {RmModal} from "./RmModal";
import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

export function ModalAction(methodOptions?: IModalAction) {

    return function (target: RmModal, propertyKey: string) {

        // (<any>target).actions = methodOptions.data || {};

        (<any>target).actions =  (<any>target).actions || {};
        (<any>target).actions[propertyKey] = methodOptions;
        (<any>target)[propertyKey] = function (...args: any[]): NgbModalRef {
            return this.open();
        }
    }
}