import { Castable } from "Illuminate/Contracts/Database/Eloquent/Castable";
import { CastsAttributes } from "Illuminate/Contracts/Database/Eloquent/CastsAttributes";
export class AsArrayObject implements Castable {
    /*Get the caster class to use when casting from / to this cast target.*/
    public static castUsing(arguments: any[]) {
        return new ()();
    }
}
