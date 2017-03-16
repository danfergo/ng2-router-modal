import {ModuleWithProviders, NgModule, SkipSelf, Optional} from "@angular/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {Providers} from "./src/Providers";
import {RmService} from "./src/RouterModalService";

export * from "./src/Interfaces"
export * from "./src/ModalParams"
export * from "./src/ModalAction"
export * from "./src/Modal"
export * from "./src/RouterModalService"

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