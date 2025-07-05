import {Building} from "./Building.ts";

export class Wisp {

    public isAssigned: boolean = false;
    private _currentAssignment: Building | undefined;

    private _pastAssignments: Building[] = [];

    get currentAssignment(): Building | undefined {
        return this._currentAssignment;
    }

    set currentAssignment(value: Building | undefined) {
        if (this._currentAssignment) {
            this._pastAssignments.push(this._currentAssignment);

            if (this._pastAssignments.length > 3) {
                this._pastAssignments = this._pastAssignments.slice(2)

            }
        }

        this._currentAssignment = value;

        if (value) {
            this._pastAssignments.push(value);
        }

    }

    public runForEveryAssignment(func: (building: Building) => void) {
        if (this._currentAssignment) {
            func(this._currentAssignment);
        }

        console.log('bbbbbbbbbbbbbbbb')

        this._pastAssignments.map(building => {

            console.log('past', building);
            func(building);
        })
    }


}