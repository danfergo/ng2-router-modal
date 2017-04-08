import {Injectable, Injector} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {StateRegistry, Transition, State, StateService, StateParams} from "ui-router-ng2"
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
export class RmService {
    private onCloseSubjects: {} = {};


    private modalRefs: {} = {};
    private modalParams: any[] = [];


    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    constructor(private stateService: StateService, private stateRegistry: StateRegistry, private injector: Injector) {

    }


    public get params(): any {
        return this.modalParams[this.modalParams.length - 1];
    }


    public open(modalType: any, action: string, params: any = null): Promise<any> {
        let modal: any = this.injector.get(modalType);
        let modalName = modal.name;

        let modalRef = modal[action]();
        this.modalRefs [modalName] = modalRef;
        this.modalParams.push(params);


        return modalRef.result.then(
            (msg: any) => {
                this.closed(modalName, msg);
                delete this.modalRefs [modalName];
                this.modalParams.pop();
                return new Promise((res, _) => res(msg));
            },
            (msg: any) => {
                this.dismissed(modalName, msg);
                delete this.modalRefs [modalName];
                this.modalParams.pop();
                return new Promise((_, rej) => rej(msg));
            });
    }


    private createState(action: string, modal: any, options: any, parentStateName: string = null) {
        let modalName: string = action + this.capitalize(modal.name);
        let stateName: string = (parentStateName ? parentStateName + '.' : '') + modalName;
        let state: any = {
            name: stateName,
            params: options.params,
            onEnter: function (trans: Transition, state: State) {
                let injector = trans.injector();
                let stateService: any = injector.get(StateService);
                let rmService: any = injector.get(RmService);

                let modalRef = modal[action]();

                rmService.modalRefs [stateName] = modalRef;
                rmService.modalParams.push(stateService.params);

                modalRef.result.then(
                    (msg: any) => {
                        rmService.closed(modalName, msg);
                        delete rmService.modalRefs [state.name];
                        rmService.modalParams.pop();
                        stateService.go('^');
                        return msg;
                    },
                    (msg: any) => {
                        rmService.dismissed(modalName, msg);
                        delete rmService.modalRefs [state.name];
                        rmService.modalParams.pop();
                        stateService.go('^');
                        return msg;
                    });
            },
            onExit: function (trans: Transition, state: State) {
                let injector = trans.injector();
                let rmService: any = injector.get(RmService);
                if (!!rmService.modalRefs [state.name]) {
                    rmService.modalRefs [state.name].dismiss();
                }
            }
        };

        if (parentStateName != null) {
            state.url = '/' + action + '-' + modal.name + (options.urlParams ? '/' + options.urlParams : '');
        }

        return state;
    }

    public initModalStates(states: any[]): void {
        for (let state of states) {
            if (state.abstract || !state.data || !state.data.modals) continue;

            this.initModalsForState(state.data.modals, state.name);
        }
    }

    private initModalsForState(modals: any[], parentStateName: string = null) {
        for (let m of modals) {
            let modal: any = this.injector.get(m);
            for (let action in modal.actions) {
                let options = modal.actions[action];
                this.stateRegistry.register(this.createState(action, modal, options, parentStateName));
            }
        }
    }

    public onClose(names: string | string[]): any {
        return this.init(names).asObservable();
    }

    private init(names: string | string[]): any {

        if (!Array.isArray(names)) names = [names];
        if (names.length === 0) return null;

        if (!this.onCloseSubjects.hasOwnProperty(names[0])) {
            let subject = new Subject<string>();

            for (let name of names) {
                this.onCloseSubjects[name] = subject;
            }
            return subject;
        }
        else
            return this.onCloseSubjects[names[0]];

    }

    private closed(modalName: string, result: any): void {
        if (this.onCloseSubjects.hasOwnProperty(modalName))
            this.onCloseSubjects[modalName].next(result);
    }

    private dismissed(modalName: string, result: any): void {

    }

}
