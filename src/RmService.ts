import {Injectable, Injector} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {UIRouter, StateRegistry, Transition, StateService, StateParams} from "@uirouter/angular"

@Injectable()
export class RmService {
    private onCloseSubjects: {} = {};


    private modalRefs: {} = {};
    private modalParams: any[] = [];

    private capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    private clean(modalName) {
        delete this.modalRefs [modalName];
        this.modalParams.pop();

    }

    constructor(private injector: Injector) {
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
                this.clean(modalName);
                return Promise.resolve(msg);
            },
            (msg: any) => {
                this.dismissed(modalName, msg);
                this.clean(modalName);
                return Promise.reject(msg);
            });
    }


    private createState(action: string, modal: any, options: any, parentStateName: string = null) {
        let modalName: string = action + this.capitalize(modal.name);
        let stateName: string = (parentStateName ? parentStateName + '.' : '') + modalName;
        let state: any = {
            name: stateName,
            params: options.params,
            onEnter: function (trans: Transition) {
                let injector = trans.injector();
                let stateService: any = injector.get(StateService);
                let rmService: any = injector.get(RmService);

                let modalRef = modal[action]();

                rmService.modalRefs [stateName] = modalRef;
                rmService.modalParams.push(stateService.params);

                modalRef.result.then(
                    (msg: any) => {
                        rmService.closed(modalName, msg);
                        rmService.clean(modalName);
                        stateService.go('^');
                        return msg;
                    },
                    (msg: any) => {
                        rmService.dismissed(modalName, msg);
                        rmService.clean(modalName);
                        stateService.go('^');
                        return msg;
                    });
            },
            onExit: function (trans: Transition) {
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
        // console.log('lol');

    public buildStates(states: any[]): any[] {
        let newStates = [];
        for (let state of states) {
            if (state.abstract || !state.data || !state.data.modals) continue;
            newStates = newStates.concat(this.buildState(state.data.modals, state.name));
        }
        return newStates;
    }

    private buildState(modals: any[], parentStateName: string = null) {
        let states = [];

        for (let m of modals) {
            let modal: any = this.injector.get(m);
            for (let action in modal.actions) {
                let options = modal.actions[action];
                if (options.params) continue;
                states.push(this.createState(action, modal, options, parentStateName));
            }
        }
        return states;
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
