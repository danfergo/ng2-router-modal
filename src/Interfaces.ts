import {ParamDeclaration} from "ui-router-ng2"

export interface IModalParams {
    component: any,
    name: string,
}


export interface IModalAction {
    urlParams?: string,
    params?: any
}
