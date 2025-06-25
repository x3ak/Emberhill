import {BuildingBase} from "./buildings.ts";

export class Wisp {
    public isAssigned: boolean = false;
    public currentAssignment: BuildingBase | undefined;
}