import { Castable } from "Illuminate/Contracts/Database/Eloquent/Castable";
import { CastsAttributes } from "Illuminate/Contracts/Database/Eloquent/CastsAttributes";
import { Crypt } from "Illuminate/Support/Facades/Crypt";
export class AsEncryptedArrayObject implements Castable {
    /*Get the caster class to use when casting from / to this cast target.*/
    public static castUsing(arguments: any[]) {
        return new ()();
    }
}
