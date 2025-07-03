import {Building} from "./Building.ts";

export class Wisp {
    public isAssigned: boolean = false;
    public currentAssignment: Building | undefined;
}