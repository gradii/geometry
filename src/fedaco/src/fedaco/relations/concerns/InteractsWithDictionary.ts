import { InvalidArgumentException } from "Doctrine/Instantiator/Exception/InvalidArgumentException";
/*trait*/ export class InteractsWithDictionary {
    /*Get a dictionary key attribute - casting it to a string if necessary.*/
    protected getDictionaryKey(attribute: any) {
        if (is_object(attribute)) {
            if (method_exists(attribute, "__toString")) {
                return attribute.__toString();
            }
            throw new InvalidArgumentException("Model attribute value is an object but does not have a __toString method.");
        }
        return attribute;
    }
}
