import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent belongs to many chunk by id", () => {
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
        });
        this.schema().create("articles", table => {
            table.increments("aid");
            table.string("title");
        });
        this.schema().create("article_user", table => {
            table.integer("article_id").unsigned();
            table.foreign("article_id").references("aid").on("articles");
            table.integer("user_id").unsigned();
            table.foreign("user_id").references("id").on("users");
        });
    });
    it("belongs to chunk by id", () => {
        this.seedData();
        var user = BelongsToManyChunkByIdTestTestUser.query().first();
        var i = 0;
        user.articles().chunkById(1, collection => {
            i++;
            this.assertEquals(i, collection.first().aid);
        });
        expect(i).toEqual(3);
    });
    it("tear down", () => {
        this.schema().drop("users");
        this.schema().drop("articles");
        this.schema().drop("article_user");
    });
    it("seed data", () => {
        var user = BelongsToManyChunkByIdTestTestUser.create({
            "id": 1,
            "email": "taylorotwell@gmail.com"
        });
        BelongsToManyChunkByIdTestTestArticle.query().insert([{
                "aid": 1,
                "title": "Another title"
            }, {
                "aid": 2,
                "title": "Another title"
            }, {
                "aid": 3,
                "title": "Another title"
            }]);
        user.articles().sync([3, 1, 2]);
    });
    it("connection", () => {
        return Eloquent.getConnectionResolver().connection();
    });
    it("schema", () => {
        return this.connection().getSchemaBuilder();
    });
});
export class BelongsToManyChunkByIdTestTestUser extends Eloquent {
    protected table: any = "users";
    protected fillable: any = ["id", "email"];
    public timestamps: any = false;
    public articles() {
        return this.belongsToMany(BelongsToManyChunkByIdTestTestArticle, "article_user", "user_id", "article_id");
    }
}
export class BelongsToManyChunkByIdTestTestArticle extends Eloquent {
    protected primaryKey: any = "aid";
    protected table: any = "articles";
    protected keyType: any = "string";
    public incrementing: any = false;
    public timestamps: any = false;
    protected fillable: any = ["aid", "title"];
}
