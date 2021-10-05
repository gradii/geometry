import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent polymorphic integration", () => {
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
            table.timestamps();
        });
        this.schema().create("posts", table => {
            table.increments("id");
            table.integer("user_id");
            table.string("title");
            table.text("body");
            table.timestamps();
        });
        this.schema().create("comments", table => {
            table.increments("id");
            table.integer("commentable_id");
            table.string("commentable_type");
            table.integer("user_id");
            table.text("body");
            table.timestamps();
        });
        this.schema().create("likes", table => {
            table.increments("id");
            table.integer("likeable_id");
            table.string("likeable_type");
            table.timestamps();
        });
    });
    it("tear down", () => {
        this.schema().drop("users");
        this.schema().drop("posts");
        this.schema().drop("comments");
    });
    it("it loads relationships automatically", () => {
        this.seedData();
        var like = TestLikeWithSingleWith.first();
        expect(like.relationLoaded("likeable")).toBeTruthy();
        expect(like.likeable).toEqual(TestComment.first());
    });
    it("it loads chained relationships automatically", () => {
        this.seedData();
        var like = TestLikeWithSingleWith.first();
        expect(like.likeable.relationLoaded("commentable")).toBeTruthy();
        expect(like.likeable.commentable).toEqual(TestPost.first());
    });
    it("it loads nested relationships automatically", () => {
        this.seedData();
        var like = TestLikeWithNestedWith.first();
        expect(like.relationLoaded("likeable")).toBeTruthy();
        expect(like.likeable.relationLoaded("owner")).toBeTruthy();
        expect(like.likeable.owner).toEqual(TestUser.first());
    });
    it("it loads nested relationships on demand", () => {
        this.seedData();
        var like = TestLike._with("likeable.owner").first();
        expect(like.relationLoaded("likeable")).toBeTruthy();
        expect(like.likeable.relationLoaded("owner")).toBeTruthy();
        expect(like.likeable.owner).toEqual(TestUser.first());
    });
    it("it loads nested morph relationships on demand", () => {
        this.seedData();
        TestPost.first().likes().create([]);
        var likes = TestLike._with("likeable.owner").get().loadMorph("likeable", {});
        expect(likes[0].relationLoaded("likeable")).toBeTruthy();
        expect(likes[0].likeable.relationLoaded("owner")).toBeTruthy();
        expect(likes[0].likeable.relationLoaded("commentable")).toBeTruthy();
        expect(likes[1].relationLoaded("likeable")).toBeTruthy();
        expect(likes[1].likeable.relationLoaded("owner")).toBeTruthy();
        expect(likes[1].likeable.relationLoaded("comments")).toBeTruthy();
    });
    it("it loads nested morph relationship counts on demand", () => {
        this.seedData();
        TestPost.first().likes().create([]);
        TestComment.first().likes().create([]);
        var likes = TestLike._with("likeable.owner").get().loadMorphCount("likeable", {});
        expect(likes[0].relationLoaded("likeable")).toBeTruthy();
        expect(likes[0].likeable.relationLoaded("owner")).toBeTruthy();
        expect(likes[0].likeable.likes_count).toEqual(2);
        expect(likes[1].relationLoaded("likeable")).toBeTruthy();
        expect(likes[1].likeable.relationLoaded("owner")).toBeTruthy();
        expect(likes[1].likeable.comments_count).toEqual(1);
        expect(likes[2].relationLoaded("likeable")).toBeTruthy();
        expect(likes[2].likeable.relationLoaded("owner")).toBeTruthy();
        expect(likes[2].likeable.likes_count).toEqual(2);
    });
    it("seed data", () => {
        var taylor = TestUser.create({
            "id": 1,
            "email": "taylorotwell@gmail.com"
        });
        taylor.posts().create({
            "title": "A title",
            "body": "A body"
        }).comments().create({
            "body": "A comment body",
            "user_id": 1
        }).likes().create([]);
    });
    it("connection", () => {
        return Eloquent.getConnectionResolver().connection();
    });
    it("schema", () => {
        return this.connection().getSchemaBuilder();
    });
});
/*Eloquent Models...*/
export class TestUser extends Eloquent {
    protected table: any = "users";
    protected guarded: any = [];
    public posts() {
        return this.hasMany(TestPost, "user_id");
    }
}
/*Eloquent Models...*/
export class TestPost extends Eloquent {
    protected table: any = "posts";
    protected guarded: any = [];
    public comments() {
        return this.morphMany(TestComment, "commentable");
    }
    public owner() {
        return this.belongsTo(TestUser, "user_id");
    }
    public likes() {
        return this.morphMany(TestLike, "likeable");
    }
}
/*Eloquent Models...*/
export class TestComment extends Eloquent {
    protected table: any = "comments";
    protected guarded: any = [];
    protected _with: any = ["commentable"];
    public owner() {
        return this.belongsTo(TestUser, "user_id");
    }
    public commentable() {
        return this.morphTo();
    }
    public likes() {
        return this.morphMany(TestLike, "likeable");
    }
}
export class TestLike extends Eloquent {
    protected table: any = "likes";
    protected guarded: any = [];
    public likeable() {
        return this.morphTo();
    }
}
export class TestLikeWithSingleWith extends Eloquent {
    protected table: any = "likes";
    protected guarded: any = [];
    protected _with: any = ["likeable"];
    public likeable() {
        return this.morphTo();
    }
}
export class TestLikeWithNestedWith extends Eloquent {
    protected table: any = "likes";
    protected guarded: any = [];
    protected _with: any = ["likeable.owner"];
    public likeable() {
        return this.morphTo();
    }
}
