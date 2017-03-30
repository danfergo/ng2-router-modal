import {ModuleWithProviders, NgModule, SkipSelf, Optional} from "@angular/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {Providers} from "./Providers";
import {RmService} from "./RouterModalService";

export * from "./Interfaces"
export * from "./ModalParams"
export * from "./ModalAction"
export * from "./Modal"
export * from "./RouterModalService"

@NgModule({
    imports: [
        NgbModule,
    ]
})
export class RouterModals {

    constructor(private rmService: RmService, @Optional() @SkipSelf() parentModule: RouterModals) {

        if (parentModule) {
            throw new Error(
                'CoreModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RouterModals,
            providers: Providers.get()

        };
    }
}