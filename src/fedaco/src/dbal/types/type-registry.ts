import { DBALException } from '../DBALException';
import { Type } from './Type';

/*The type registry is responsible for holding a map of all known DBAL types.
The types are stored using the flyweight pattern so that one type only exists as exactly one instance.*/
export class TypeRegistry {
  /**/
  private instances: { [key: string]: Type } = {};

  /*Finds a type by the given name.*/
  public get(name) {
    if (!(this.instances[name] !== undefined)) {
      throw DBALException.unknownColumnType(name);
    }
    return this.instances[name];
  }

  /*Finds a name for the given type.*/
  public lookupName(type) {
    var name = this.findTypeName(type);
    if (name === null) {
      throw DBALException.typeNotRegistered(type);
    }
    return name;
  }

  /*Checks if there is a type of the given name.*/
  public has(name) {
    return this.instances[name] !== undefined;
  }

  /*Registers a custom type to the type map.*/
  public register(name, type) {
    if (this.instances[name] !== undefined) {
      throw DBALException.typeExists(name);
    }
    if (this.findTypeName(type) !== null) {
      throw DBALException.typeAlreadyRegistered(type);
    }
    this.instances[name] = type;
  }

  /*Overrides an already defined type to use a different implementation.*/
  public override(name, type) {
    if (!(this.instances[name] !== undefined)) {
      throw DBALException.typeNotFound(name);
    }
    if (!in_array(this.findTypeName(type), [name, null], true)) {
      throw DBALException.typeAlreadyRegistered(type);
    }
    this.instances[name] = type;
  }

  /*Gets the map of all registered types and their corresponding type instances.*/
  public getMap() {
    return this.instances;
  }

  private findTypeName(type) {
    var name = array_search(type, this.instances, true);
    if (name === false) {
      return null;
    }
    return name;
  }
}
