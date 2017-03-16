import {Injectable, Type, Injector} from "@angular/core";
import {Subject, Observable} from "rxjs";
import {StateRegistry, Transition, State, StateService} from "ui-router-ng2"

@Injectable()
export class RmService {
    private subjects: {} = {};
    private observables: {} = {};


    private modalRefs: {} = {};


    private capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    constructor(private stateService: StateService, private stateRegistry: StateRegistry, private injector: Injector) {

    }

    public loadModalStates(states: any[]) {

        for (let state of states) {

            if (state.data && state.data.modals) {
                let modals = state.data.modals;
                for (let m of modals) {
                    let modal: any = this.injector.get(m);
                    // console.log(state.name + '.' + 'create' + self.capitalize(modal.name));

                    for (let action of modal.actions) {
                        // console.log(this.capitalize(modal.name));
                        // console.log(state + '.' + action + modal.name.capitalize());
                        let stateName: string = state.name + '.' + action + this.capitalize(modal.name);
                        this.stateRegistry.register({
                            name: stateName,
                            url: '/' + action + '-' + modal.name,
                            onEnter: function (trans: Transition, state: State) {

                                let injector = trans.injector();
                                let stateService: any = injector.get(StateService);
                                let rmService: any = injector.get(RmService);

                                let modalRef = modal[action]();
                                rmService.modalRefs [stateName] = modalRef;

                                modalRef.result.then(
                                    (msg: any) => {
                                        rmService.closed(action + this.capitalize(modal.name), msg);
                                        return msg;
                                    },
                                    (msg: any) => {
                                        rmService.dismissed(action + this.capitalize(modal.name), msg);
                                        return msg;
                                    }
                                ).then(
                                    (x: any) => {
                                        if (!x || !x.$$__NO__GO__ || !(x.$$__NO__GO__ == true)) {
                                            delete rmService.modalRefs [state.name];
                                            stateService.go('^')
                                        }
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
                                    rmService.modalRefs [state.name].dismiss({$$__NO__GO__: true});
                                    delete rmService.modalRefs [state.name];
                                }
                            }
                        });
                        // StateService.propertyIsEnumerable()
                    }
                }
            }
        }
    }


    public get(modalName: string) {
        this.init(modalName);
        return this.observables[modalName];
    }

    private init(modalName: string) {
        if (!this.subjects.hasOwnProperty(modalName)) {
            this.subjects[modalName] = new Subject<string>();
        }
        this.observables[modalName] = this.subjects[modalName].asObservable();
    }

    private closed(modalName: string, result: any) {
        this.subjects[modalName].next(result);
    }

    private dismissed(modalName: string, result: any) {

    }

}
