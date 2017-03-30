import {Injectable, Injector} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {StateRegistry, Transition, State, StateService} from "ui-router-ng2"

@Injectable()
export class RmService {
    private subjects: {} = {};
    private observables: {} = {};


    private modalRefs: {} = {};


    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    constructor(private stateService: StateService, private stateRegistry: StateRegistry, private injector: Injector) {

    }


    private createState(action: string, name: string, modal: any) {
        let modalName: string = this.capitalize(modal.name);
        return {
            name: name,
            url: '/' + action + '-' + modal.name,
            onEnter: function (trans: Transition, state: State) {
                let injector = trans.injector();
                let stateService: any = injector.get(StateService);
                let rmService: any = injector.get(RmService);

                let modalRef = modal[action]();
                rmService.modalRefs [name] = modalRef;

                modalRef.result.then(
                    (msg: any) => {
                        rmService.closed(action + modalName, msg);
                        return msg;
                    },
                    (msg: any) => {
                        rmService.dismissed(action + modalName, msg);
                        return msg;
                    }
                ).then(
                    (x: any) => {
                        delete rmService.modalRefs [state.name];
                        stateService.go('^')
                    },
                    (x: any) => {
                        delete rmService.modalRefs [state.name];
                        stateService.go('^')
                    }
                );
            },
            onExit: function (trans: Transition, state: State) {
                let injector = trans.injector();
                let rmService: any = injector.get(RmService);
                if (!!rmService.modalRefs [state.name]) {
                    rmService.modalRefs [state.name].dismiss();
                }
            }
        }
    }

    public loadModalStates(states: any[]): void {
        for (let state of states) {

            if (state.data && state.data.modals) {
                let modals = state.data.modals;
                for (let m of modals) {
                    let modal: any = this.injector.get(m);

                    for (let action of modal.actions) {
                        let stateName: string = state.name + '.' + action + this.capitalize(modal.name);
                        this.stateRegistry.register(this.createState(action, stateName, modal));
                    }
                }
            }
        }
    }


    public get(modalName: string): any {
        this.init(modalName);
        return this.observables[modalName];
    }

    private init(modalName: string): void {
        if (!this.subjects.hasOwnProperty(modalName)) {
            this.subjects[modalName] = new Subject<string>();
        }
        this.observables[modalName] = this.subjects[modalName].asObservable();
    }

    private closed(modalName: string, result: any): void {
        this.subjects[modalName].next(result);
    }

    private dismissed(modalName: string, result: any): void {

    }

}
