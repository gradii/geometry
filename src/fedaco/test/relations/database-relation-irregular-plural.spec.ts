import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Carbon } from "Illuminate/Support/Carbon";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent irregular plural", () => {
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
        this.schema().create("irregular_plural_humans", table => {
            table.increments("id");
            table.string("email").unique();
            table.timestamps();
        });
        this.schema().create("irregular_plural_tokens", table => {
            table.increments("id");
            table.string("title");
        });
        this.schema().create("irregular_plural_human_irregular_plural_token", table => {
            table.integer("irregular_plural_human_id").unsigned();
            table.integer("irregular_plural_token_id").unsigned();
        });
        this.schema().create("irregular_plural_mottoes", table => {
            table.increments("id");
            table.string("name");
        });
        this.schema().create("cool_mottoes", table => {
            table.integer("irregular_plural_motto_id");
            table.integer("cool_motto_id");
            table.string("cool_motto_type");
        });
    });
    it("tear down", () => {
        this.schema().drop("irregular_plural_tokens");
        this.schema().drop("irregular_plural_humans");
        this.schema().drop("irregular_plural_human_irregular_plural_token");
    });
    it("schema", () => {
        var connection = Model.getConnectionResolver().connection();
        return connection.getSchemaBuilder();
    });
    it("it pluralizes the table name", () => {
        var model = new IrregularPluralHuman();
        expect(model.getTable()).toBe("irregular_plural_humans");
    });
    it("it touches the parent with an irregular plural", () => {
        Carbon.setTestNow("2018-05-01 12:13:14");
        IrregularPluralHuman.create({
            "email": "taylorotwell@gmail.com"
        });
        IrregularPluralToken.insert([{
                "title": "The title"
            }]);
        var human = IrregularPluralHuman.query().first();
        var tokenIds = IrregularPluralToken.pluck("id");
        Carbon.setTestNow("2018-05-01 15:16:17");
        human.irregularPluralTokens().sync(tokenIds);
        human.refresh();
        expect(/*cast type string*/ human.created_at).toBe("2018-05-01 12:13:14");
        expect(/*cast type string*/ human.updated_at).toBe("2018-05-01 15:16:17");
    });
    it("it pluralizes morph to many relationships", () => {
        var human = IrregularPluralHuman.create({
            "email": "bobby@example.com"
        });
        human.mottoes().create({
            "name": "Real eyes realize real lies"
        });
        var motto = IrregularPluralMotto.query().first();
        expect(motto.name).toBe("Real eyes realize real lies");
    });
});
export class IrregularPluralHuman extends Model {
    protected guarded: any = [];
    public irregularPluralTokens() {
        return this.belongsToMany(IrregularPluralToken, "irregular_plural_human_irregular_plural_token", "irregular_plural_token_id", "irregular_plural_human_id");
    }
    public mottoes() {
        return this.morphToMany(IrregularPluralMotto, "cool_motto");
    }
}
export class IrregularPluralToken extends Model {
    protected guarded: any = [];
    public timestamps: any = false;
    protected touches: any = ["irregularPluralHumans"];
}
export class IrregularPluralMotto extends Model {
    protected guarded: any = [];
    public timestamps: any = false;
    public irregularPluralHumans() {
        return this.morphedByMany(IrregularPluralHuman, "cool_motto");
    }
}
