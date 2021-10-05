import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";
import { Relation } from "Illuminate/Database/Eloquent/Relations/Relation";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent integration with table prefix", () => {
    it("set up", () => {
        var db = new DB();
        db.addConnection({
            "driver": "sqlite",
            "database": ":memory:"
        });
        db.bootEloquent();
        db.setAsGlobal();
        Eloquent.getConnectionResolver().connection().setTablePrefix("prefix_");
        this.createSchema();
    });
    it("create schema", () => {
        this.schema("default").create("users", table => {
            table.increments("id");
            table.string("email");
            table.timestamps();
        });
        this.schema("default").create("friends", table => {
            table.integer("user_id");
            table.integer("friend_id");
        });
        this.schema("default").create("posts", table => {
            table.increments("id");
            table.integer("user_id");
            table.integer("parent_id").nullable();
            table.string("name");
            table.timestamps();
        });
        this.schema("default").create("photos", table => {
            table.increments("id");
            table.morphs("imageable");
            table.string("name");
            table.timestamps();
        });
    });
    it("tear down", () => {
        [].forEach((connection, index) => {
        });
        Relation.morphMap([], false);
    });
    it("basic model hydration", () => {
        EloquentTestUser.create({
            "email": "taylorotwell@gmail.com"
        });
        EloquentTestUser.create({
            "email": "abigailotwell@gmail.com"
        });
        var models = EloquentTestUser.fromQuery("SELECT * FROM prefix_users WHERE email = ?", ["abigailotwell@gmail.com"]);
        expect(models).toInstanceOf(Collection);
        expect(models[0]).toInstanceOf(EloquentTestUser);
        expect(models[0].email).toBe("abigailotwell@gmail.com");
        expect(models).toCount(1);
    });
    it("connection", () => {
        return Eloquent.getConnectionResolver().connection(connection);
    });
    it("schema", () => {
        return this.connection(connection).getSchemaBuilder();
    });
});
