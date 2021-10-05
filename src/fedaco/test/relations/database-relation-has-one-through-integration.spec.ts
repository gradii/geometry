import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";
import { ModelNotFoundException } from "Illuminate/Database/Eloquent/ModelNotFoundException";
import { SoftDeletes } from "Illuminate/Database/Eloquent/SoftDeletes";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent has one through integration", () => {
    it("set up", () => {
        var db = new DB();
        db.addConnection({
            "driver": "sqlite",
            "database": ":memory:"
        });
        db.bootEloquent();
        db.setAsGlobal();
        this.createSchema();
    });
    it("create schema", () => {
        this.schema().create("users", table => {
            table.increments("id");
            table.string("email").unique();
            table.unsignedInteger("position_id").unique().nullable();
            table.string("position_short");
            table.timestamps();
            table.softDeletes();
        });
        this.schema().create("contracts", table => {
            table.increments("id");
            table.integer("user_id").unique();
            table.string("title");
            table.text("body");
            table.string("email");
            table.timestamps();
        });
        this.schema().create("positions", table => {
            table.increments("id");
            table.string("name");
            table.string("shortname");
            table.timestamps();
        });
    });
    it("tear down", () => {
        this.schema().drop("users");
        this.schema().drop("contracts");
        this.schema().drop("positions");
    });
    it("it loads a has one through relation with custom keys", () => {
        this.seedData();
        var contract = HasOneThroughTestPosition.first().contract;
        expect(contract.title).toBe("A title");
    });
    it("it loads a default has one through relation", () => {
        this.migrateDefault();
        this.seedDefaultData();
        var contract = HasOneThroughDefaultTestPosition.first().contract;
        expect(contract.title).toBe("A title");
        expect(contract.getAttributes()).toArrayNotHasKey("email");
        this.resetDefault();
    });
    it("it loads a relation with custom intermediate and local key", () => {
        this.seedData();
        var contract = HasOneThroughIntermediateTestPosition.first().contract;
        expect(contract.title).toBe("A title");
    });
    it("eager loading a relation with custom intermediate and local key", () => {
        this.seedData();
        var contract = HasOneThroughIntermediateTestPosition._with("contract").first().contract;
        expect(contract.title).toBe("A title");
    });
    it("where has on a relation with custom intermediate and local key", () => {
        this.seedData();
        var position = HasOneThroughIntermediateTestPosition.whereHas("contract", query => {
            query.where("title", "A title");
        }).get();
        expect(position).toCount(1);
    });
    it("first or fail throws an exception", () => {
        this.expectException(ModelNotFoundException);
        this.expectExceptionMessage("No query results for model [Illuminate\\Tests\\Database\\HasOneThroughTestContract].");
        HasOneThroughTestPosition.create({
            "id": 1,
            "name": "President",
            "shortname": "ps"
        }).user().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "position_short": "ps"
        });
        HasOneThroughTestPosition.first().contract().firstOrFail();
    });
    it("find or fail throws an exception", () => {
        this.expectException(ModelNotFoundException);
        HasOneThroughTestPosition.create({
            "id": 1,
            "name": "President",
            "shortname": "ps"
        }).user().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "position_short": "ps"
        });
        HasOneThroughTestPosition.first().contract().findOrFail(1);
    });
    it("first retrieves first record", () => {
        this.seedData();
        var contract = HasOneThroughTestPosition.first().contract().first();
        expect(contract).toNotNull();
        expect(contract.title).toBe("A title");
    });
    it("all columns are retrieved by default", () => {
        this.seedData();
        var contract = HasOneThroughTestPosition.first().contract().first();
        expect(array_keys(contract.getAttributes())).toEqual(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"]);
    });
    it("only proper columns are selected if provided", () => {
        this.seedData();
        var contract = HasOneThroughTestPosition.first().contract().first(["title", "body"]);
        expect(array_keys(contract.getAttributes())).toEqual(["title", "body", "laravel_through_key"]);
    });
    it("chunk returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var position = HasOneThroughTestPosition.find(1);
        position.contract().chunk(10, contractsChunk => {
            var contract = contractsChunk.first();
            this.assertEquals(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"], array_keys(contract.getAttributes()));
        });
    });
    it("cursor returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var position = HasOneThroughTestPosition.find(1);
        var contracts = position.contract().cursor();
        for (let contract of contracts) {
            expect(array_keys(contract.getAttributes())).toEqual(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"]);
        }
    });
    it("each returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var position = HasOneThroughTestPosition.find(1);
        position.contract().each(contract => {
            this.assertEquals(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"], array_keys(contract.getAttributes()));
        });
    });
    it("intermediate soft deletes are ignored", () => {
        this.seedData();
        HasOneThroughSoftDeletesTestUser.first().delete();
        var contract = HasOneThroughSoftDeletesTestPosition.first().contract;
        expect(contract.title).toBe("A title");
    });
    it("eager loading loads related models correctly", () => {
        this.seedData();
        var position = HasOneThroughSoftDeletesTestPosition._with("contract").first();
        expect(position.shortname).toBe("ps");
        expect(position.contract.title).toBe("A title");
    });
    it("seed data", () => {
        HasOneThroughTestPosition.create({
            "id": 1,
            "name": "President",
            "shortname": "ps"
        }).user().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "position_short": "ps"
        }).contract().create({
            "title": "A title",
            "body": "A body",
            "email": "taylorotwell@gmail.com"
        });
    });
    it("seed data extended", () => {
        var position = HasOneThroughTestPosition.create({
            "id": 2,
            "name": "Vice President",
            "shortname": "vp"
        });
        position.user().create({
            "id": 2,
            "email": "example1@gmail.com",
            "position_short": "vp"
        }).contract().create({
            "title": "Example1 title1",
            "body": "Example1 body1",
            "email": "example1contract1@gmail.com"
        });
    });
    it("seed default data", () => {
        HasOneThroughDefaultTestPosition.create({
            "id": 1,
            "name": "President"
        }).user().create({
            "id": 1,
            "email": "taylorotwell@gmail.com"
        }).contract().create({
            "title": "A title",
            "body": "A body"
        });
    });
    it("reset default", () => {
        this.schema().drop("users_default");
        this.schema().drop("contracts_default");
        this.schema().drop("positions_default");
    });
    it("migrate default", () => {
        this.schema().create("users_default", table => {
            table.increments("id");
            table.string("email").unique();
            table.unsignedInteger("has_one_through_default_test_position_id").unique().nullable();
            table.timestamps();
        });
        this.schema().create("contracts_default", table => {
            table.increments("id");
            table.integer("has_one_through_default_test_user_id").unique();
            table.string("title");
            table.text("body");
            table.timestamps();
        });
        this.schema().create("positions_default", table => {
            table.increments("id");
            table.string("name");
            table.timestamps();
        });
    });
    it("connection", () => {
        return Eloquent.getConnectionResolver().connection();
    });
    it("schema", () => {
        return this.connection().getSchemaBuilder();
    });
});
/*Eloquent Models...*/
export class HasOneThroughTestUser extends Eloquent {
    protected table: any = "users";
    protected guarded: any = [];
    public contract() {
        return this.hasOne(HasOneThroughTestContract, "user_id");
    }
}
/*Eloquent Models...*/
export class HasOneThroughTestContract extends Eloquent {
    protected table: any = "contracts";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasOneThroughTestUser, "user_id");
    }
}
export class HasOneThroughTestPosition extends Eloquent {
    protected table: any = "positions";
    protected guarded: any = [];
    public contract() {
        return this.hasOneThrough(HasOneThroughTestContract, HasOneThroughTestUser, "position_id", "user_id");
    }
    public user() {
        return this.hasOne(HasOneThroughTestUser, "position_id");
    }
}
/*Eloquent Models...*/
export class HasOneThroughDefaultTestUser extends Eloquent {
    protected table: any = "users_default";
    protected guarded: any = [];
    public contract() {
        return this.hasOne(HasOneThroughDefaultTestContract);
    }
}
/*Eloquent Models...*/
export class HasOneThroughDefaultTestContract extends Eloquent {
    protected table: any = "contracts_default";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasOneThroughDefaultTestUser);
    }
}
export class HasOneThroughDefaultTestPosition extends Eloquent {
    protected table: any = "positions_default";
    protected guarded: any = [];
    public contract() {
        return this.hasOneThrough(HasOneThroughDefaultTestContract, HasOneThroughDefaultTestUser);
    }
    public user() {
        return this.hasOne(HasOneThroughDefaultTestUser);
    }
}
export class HasOneThroughIntermediateTestPosition extends Eloquent {
    protected table: any = "positions";
    protected guarded: any = [];
    public contract() {
        return this.hasOneThrough(HasOneThroughTestContract, HasOneThroughTestUser, "position_short", "email", "shortname", "email");
    }
    public user() {
        return this.hasOne(HasOneThroughTestUser, "position_id");
    }
}
export class HasOneThroughSoftDeletesTestUser extends Eloquent {
    protected table: any = "users";
    protected guarded: any = [];
    public contract() {
        return this.hasOne(HasOneThroughSoftDeletesTestContract, "user_id");
    }
}
/*Eloquent Models...*/
export class HasOneThroughSoftDeletesTestContract extends Eloquent {
    protected table: any = "contracts";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasOneThroughSoftDeletesTestUser, "user_id");
    }
}
export class HasOneThroughSoftDeletesTestPosition extends Eloquent {
    protected table: any = "positions";
    protected guarded: any = [];
    public contract() {
        return this.hasOneThrough(HasOneThroughSoftDeletesTestContract, HasOneThroughTestUser, "position_id", "user_id");
    }
    public user() {
        return this.hasOne(HasOneThroughSoftDeletesTestUser, "position_id");
    }
}
