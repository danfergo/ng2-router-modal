import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

export class RmModal {

    component: any;
    actions: string[];

    constructor(private modalService: NgbModal) {
        // injector.get(EventModalComponent);

        //
        //
        // this.modalRef = this.modalService.open(this.component, { windowClass: 'dark-modal' });
        // this.modalRef.componentInstance.name = 'World';
        // this.modalRef.result.then(
        //     (x) => console.log('closed ' + x),
        //     (x) => console.log('dismissed ' + x)
        // );
    }

    public open(): NgbModalRef {
        let modalRef = this.modalService.open(this.component, {
        });
        return modalRef;
    }

    //
    // create(): NgbModalRef {
    //     return this.open();
    // }
    //
    // update(): NgbModalRef {
    //     return this.open();
    // }

}