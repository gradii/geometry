import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";

describe("test database eloquent belongs to many sync return value type", () => {
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
            table.string("id");
            table.string("title");
            table.primary("id");
        });
        this.schema().create("article_user", table => {
            table.string("article_id");
            table.foreign("article_id").references("id").on("articles");
            table.integer("user_id").unsigned();
            table.foreign("user_id").references("id").on("users");
        });
    });
    it("tear down", () => {
        this.schema().drop("users");
        this.schema().drop("articles");
        this.schema().drop("article_user");
    });
    it("seed data", () => {
        BelongsToManySyncTestTestUser.create({
            "id": 1,
            "email": "taylorotwell@gmail.com"
        });
        BelongsToManySyncTestTestArticle.insert([{
                "id": "7b7306ae-5a02-46fa-a84c-9538f45c7dd4",
                "title": "uuid title"
            }, {
                "id": /*cast type string*/ PHP_INT_MAX + 1,
                "title": "Another title"
            }, {
                "id": "1",
                "title": "Another title"
            }]);
    });
    it("sync return value type", () => {
        this.seedData();
        var user = BelongsToManySyncTestTestUser.query().first();
        var articleIDs = BelongsToManySyncTestTestArticle.all().pluck("id").toArray();
        var changes = user.articles().sync(articleIDs);
        collect(changes["attached"]).map(id => {
            this.assertSame(gettype(id), new BelongsToManySyncTestTestArticle().getKeyType());
        });
    });
    it("connection", () => {
        return Eloquent.getConnectionResolver().connection();
    });
    it("schema", () => {
        return this.connection().getSchemaBuilder();
    });
});
export class BelongsToManySyncTestTestUser extends Eloquent {
    protected table: any = "users";
    protected fillable: any = ["id", "email"];
    public timestamps: any = false;
    public articles() {
        return this.belongsToMany(BelongsToManySyncTestTestArticle, "article_user", "user_id", "article_id");
    }
}
export class BelongsToManySyncTestTestArticle extends Eloquent {
    protected table: any = "articles";
    protected keyType: any = "string";
    public incrementing: any = false;
    public timestamps: any = false;
    protected fillable: any = ["id", "title"];
}
