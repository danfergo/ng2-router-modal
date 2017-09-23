import {ModuleWithProviders, NgModule, SkipSelf, Optional} from "@angular/core";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";

import {Providers} from "./Providers";
import {RmService} from "./RmService";

export * from "./Interfaces"
export * from "./ModalParams"
export * from "./ModalAction"
export * from "./RmModal"
export * from "./RmService"

@NgModule({
    imports: [
        NgbModule,
    ]
})
export class RouterModals {

    constructor(@Optional() @SkipSelf() parentModule: RouterModals) {
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