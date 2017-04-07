
[![npm version](https://badge.fury.io/js/ng2-router-modal.svg)](https://badge.fury.io/js/ng2-router-modal)

[![NPM](https://nodei.co/npm/ng2-router-modal.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ng2-router-modal/)

# ng2-router-modal
Angular2 module that integrates [ng-bootstrap](https://ng-bootstrap.github.io) modal with [ui-router](https://ui-router.github.io/ng2/) state's tree.

**DISCLAIMER!** this module is still under high development; If you have suggestions and or problems feel free to post them on issues. 

### Features
* **State's tree integration**: open modal with uiSref; unique URL for page with modal opened; auto close modal backtrack.
* **Async callback**: register callback for onClose/onDismiss at parent state controller.
* **Open modal with params**: open modal without State Tree / Url integration ; access parameters inside the modal the same way; 

### Install

```
npm install ng2-router-modal
```

and add to AppModule and initialize modal states initialization at UIRouter config function,

```ts
@NgModule({
  imports: [
    ... 
    UIRouterModule.forRoot({
        ...
        config: function(router: UIRouter, injector: Injector){
            let rmService = injector.get(RmService);
            let states = injector.get(StateService).get();
            rmService.initModalStates(states);
            ...
        }
    }),
    ResourceModule.forRoot()
  ],
})
```


## How to use

### Creating a simple Modal

Start by creating a service that extends **RmService**. Declare the modal params with @ModalParams and action specific params with @ModalAction annotations.

```ts
import {RmModal, ModalParams, ModalAction} from "ng2-router-modal";
import {ThingModalComponent} from "./thing-modal.component";

import {NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

@Injectable()
@ModalParams({
    name: 'thing',
    component: ThingModalComponent
})
export class ThingModal extends RmModal {

    @ModalAction({})
    create: NgbModalRef;
    
    @ModalAction({
        urlParams: '{id:int}'
    })
    update: NgbModalRef;
    
}
```

**./thing-modal.component.ts** is your regular component containing the ng-bootstrap Modal:
```ts
@Component({
    selector: 'thing-modal',
    templateUrl: 'thing-modal.html',
    ... 
})
export class ThingModalComponent implements OnInit{

    constructor(private activeModal: NgbActiveModal, private rmService: RmService, ...) {
    }
    
    ngOnInit(){
        console.log(rmService.params.id); 
    }
    ... 
}
```

add/link the modal to an existing state (**./some-module.states.ts**):
```ts
name: 'somePage',
url: '/somepage',
component: SomepageComponent,
data: {
    ...
    modals: [
        ThingModal
    ]
}
...
```

Open your modal at `your-website/somepage/create-thing` to create a new Thing or `your-website/somepage/update-thing/123`
to update an existing Thing. You can update the modal pragmatically via the state names (do not forget to pass the parameters).
```html 
<a uiSref='somePage.createThing'>New Thing</a>
<a uiSref='somePage.updateThing' [uiParams]='{id: 123}'>Update Thing 123</a>
```


### Subscribing for onClose/onDismiss callback

The handler is called every time the modal/action is closed/dismissed. **do not forget** to unsubscribe the observers

```ts
export class SomepageComponent implements OnDestroy {

    constructor(private rmService: RmService ... ){
        this.thingCloseSub = rmService.onClose(['createThing', 'updateThing']).subscribe((thing: any) => {
               console.log(thing)
        });
        
        this.thingDismissSub = rmService.onDismiss(['createThing']).subscribe((thing: any) => {
           console.log('user dismissed modal when creating a thing');
        });
        ...        
    }
    
    ngOnDestroy(): void {
        this.thingCloseSub.unsubscribe();
        this.thingDismissSub.unsubscribe();
    }
}
...
```


### Open modal with params

Using the `open` method you can use the returned promise or the `onClose`/`onDismiss` methods to receive the result.


```ts
export class NavbarComponent {

    constructor(private rmService: RmService ... ){}
    
    openThing(): void {
        this.rmService.open(ThingModal, 'create', {someparam: 'some value'}).then(
                thing => (console.log(thing),
                msg => console.log('user dismissed modal with ' + msg )
        );
    }
}
...
```


(in progress)