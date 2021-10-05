import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Model as Eloquent } from "Illuminate/Database/Eloquent/Model";
import { ModelNotFoundException } from "Illuminate/Database/Eloquent/ModelNotFoundException";
import { SoftDeletes } from "Illuminate/Database/Eloquent/SoftDeletes";
import { Collection } from "Illuminate/Support/Collection";
import { LazyCollection } from "Illuminate/Support/LazyCollection";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent has many through integration", () => {
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
            table.unsignedInteger("country_id");
            table.string("country_short");
            table.timestamps();
            table.softDeletes();
        });
        this.schema().create("posts", table => {
            table.increments("id");
            table.integer("user_id");
            table.string("title");
            table.text("body");
            table.string("email");
            table.timestamps();
        });
        this.schema().create("countries", table => {
            table.increments("id");
            table.string("name");
            table.string("shortname");
            table.timestamps();
        });
    });
    it("tear down", () => {
        this.schema().drop("users");
        this.schema().drop("posts");
        this.schema().drop("countries");
    });
    it("it loads a has many through relation with custom keys", () => {
        this.seedData();
        var posts = HasManyThroughTestCountry.first().posts;
        expect(posts[0].title).toBe("A title");
        expect(posts).toCount(2);
    });
    it("it loads a default has many through relation", () => {
        this.migrateDefault();
        this.seedDefaultData();
        var posts = HasManyThroughDefaultTestCountry.first().posts;
        expect(posts[0].title).toBe("A title");
        expect(posts).toCount(2);
        this.resetDefault();
    });
    it("it loads a relation with custom intermediate and local key", () => {
        this.seedData();
        var posts = HasManyThroughIntermediateTestCountry.first().posts;
        expect(posts[0].title).toBe("A title");
        expect(posts).toCount(2);
    });
    it("eager loading a relation with custom intermediate and local key", () => {
        this.seedData();
        var posts = HasManyThroughIntermediateTestCountry._with("posts").first().posts;
        expect(posts[0].title).toBe("A title");
        expect(posts).toCount(2);
    });
    it("where has on a relation with custom intermediate and local key", () => {
        this.seedData();
        var country = HasManyThroughIntermediateTestCountry.whereHas("posts", query => {
            query.where("title", "A title");
        }).get();
        expect(country).toCount(1);
    });
    it("find method", () => {
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        }).posts().createMany([{
                "id": 1,
                "title": "A title",
                "body": "A body",
                "email": "taylorotwell@gmail.com"
            }, {
                "id": 2,
                "title": "Another title",
                "body": "Another body",
                "email": "taylorotwell@gmail.com"
            }]);
        var country = HasManyThroughTestCountry.first();
        var post = country.posts().find(1);
        expect(post).toNotNull();
        expect(post.title).toBe("A title");
        expect(country.posts().find([1, 2])).toCount(2);
        expect(country.posts().find(new Collection([1, 2]))).toCount(2);
    });
    it("find many method", () => {
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        }).posts().createMany([{
                "id": 1,
                "title": "A title",
                "body": "A body",
                "email": "taylorotwell@gmail.com"
            }, {
                "id": 2,
                "title": "Another title",
                "body": "Another body",
                "email": "taylorotwell@gmail.com"
            }]);
        var country = HasManyThroughTestCountry.first();
        expect(country.posts().findMany([1, 2])).toCount(2);
        expect(country.posts().findMany(new Collection([1, 2]))).toCount(2);
    });
    it("first or fail throws an exception", () => {
        this.expectException(ModelNotFoundException);
        this.expectExceptionMessage("No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost].");
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        });
        HasManyThroughTestCountry.first().posts().firstOrFail();
    });
    it("find or fail throws an exception", () => {
        this.expectException(ModelNotFoundException);
        this.expectExceptionMessage("No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1");
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        });
        HasManyThroughTestCountry.first().posts().findOrFail(1);
    });
    it("find or fail with many throws an exception", () => {
        this.expectException(ModelNotFoundException);
        this.expectExceptionMessage("No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1, 2");
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        }).posts().create({
            "id": 1,
            "title": "A title",
            "body": "A body",
            "email": "taylorotwell@gmail.com"
        });
        HasManyThroughTestCountry.first().posts().findOrFail([1, 2]);
    });
    it("find or fail with many using collection throws an exception", () => {
        this.expectException(ModelNotFoundException);
        this.expectExceptionMessage("No query results for model [Illuminate\\Tests\\Database\\HasManyThroughTestPost] 1, 2");
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        }).posts().create({
            "id": 1,
            "title": "A title",
            "body": "A body",
            "email": "taylorotwell@gmail.com"
        });
        HasManyThroughTestCountry.first().posts().findOrFail(new Collection([1, 2]));
    });
    it("first retrieves first record", () => {
        this.seedData();
        var post = HasManyThroughTestCountry.first().posts().first();
        expect(post).toNotNull();
        expect(post.title).toBe("A title");
    });
    it("all columns are retrieved by default", () => {
        this.seedData();
        var post = HasManyThroughTestCountry.first().posts().first();
        expect(array_keys(post.getAttributes())).toEqual(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"]);
    });
    it("only proper columns are selected if provided", () => {
        this.seedData();
        var post = HasManyThroughTestCountry.first().posts().first(["title", "body"]);
        expect(array_keys(post.getAttributes())).toEqual(["title", "body", "laravel_through_key"]);
    });
    it("chunk returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var country = HasManyThroughTestCountry.find(2);
        country.posts().chunk(10, postsChunk => {
            var post = postsChunk.first();
            this.assertEquals(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"], array_keys(post.getAttributes()));
        });
    });
    it("chunk by id", () => {
        this.seedData();
        this.seedDataExtended();
        var country = HasManyThroughTestCountry.find(2);
        var i = 0;
        var count = 0;
        country.posts().chunkById(2, collection => {
            i++;
            count += collection.count();
        });
        expect(i).toEqual(3);
        expect(count).toEqual(6);
    });
    it("cursor returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var country = HasManyThroughTestCountry.find(2);
        var posts = country.posts().cursor();
        expect(posts).toInstanceOf(LazyCollection);
        for (let post of posts) {
            expect(array_keys(post.getAttributes())).toEqual(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"]);
        }
    });
    it("each returns correct models", () => {
        this.seedData();
        this.seedDataExtended();
        var country = HasManyThroughTestCountry.find(2);
        country.posts().each(post => {
            this.assertEquals(["id", "user_id", "title", "body", "email", "created_at", "updated_at", "laravel_through_key"], array_keys(post.getAttributes()));
        });
    });
    it("intermediate soft deletes are ignored", () => {
        this.seedData();
        HasManyThroughSoftDeletesTestUser.first().delete();
        var posts = HasManyThroughSoftDeletesTestCountry.first().posts;
        expect(posts[0].title).toBe("A title");
        expect(posts).toCount(2);
    });
    it("eager loading loads related models correctly", () => {
        this.seedData();
        var country = HasManyThroughSoftDeletesTestCountry._with("posts").first();
        expect(country.shortname).toBe("us");
        expect(country.posts[0].title).toBe("A title");
        expect(country.posts).toCount(2);
    });
    it("seed data", () => {
        HasManyThroughTestCountry.create({
            "id": 1,
            "name": "United States of America",
            "shortname": "us"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com",
            "country_short": "us"
        }).posts().createMany([{
                "title": "A title",
                "body": "A body",
                "email": "taylorotwell@gmail.com"
            }, {
                "title": "Another title",
                "body": "Another body",
                "email": "taylorotwell@gmail.com"
            }]);
    });
    it("seed data extended", () => {
        var country = HasManyThroughTestCountry.create({
            "id": 2,
            "name": "United Kingdom",
            "shortname": "uk"
        });
        country.users().create({
            "id": 2,
            "email": "example1@gmail.com",
            "country_short": "uk"
        }).posts().createMany([{
                "title": "Example1 title1",
                "body": "Example1 body1",
                "email": "example1post1@gmail.com"
            }, {
                "title": "Example1 title2",
                "body": "Example1 body2",
                "email": "example1post2@gmail.com"
            }]);
        country.users().create({
            "id": 3,
            "email": "example2@gmail.com",
            "country_short": "uk"
        }).posts().createMany([{
                "title": "Example2 title1",
                "body": "Example2 body1",
                "email": "example2post1@gmail.com"
            }, {
                "title": "Example2 title2",
                "body": "Example2 body2",
                "email": "example2post2@gmail.com"
            }]);
        country.users().create({
            "id": 4,
            "email": "example3@gmail.com",
            "country_short": "uk"
        }).posts().createMany([{
                "title": "Example3 title1",
                "body": "Example3 body1",
                "email": "example3post1@gmail.com"
            }, {
                "title": "Example3 title2",
                "body": "Example3 body2",
                "email": "example3post2@gmail.com"
            }]);
    });
    it("seed default data", () => {
        HasManyThroughDefaultTestCountry.create({
            "id": 1,
            "name": "United States of America"
        }).users().create({
            "id": 1,
            "email": "taylorotwell@gmail.com"
        }).posts().createMany([{
                "title": "A title",
                "body": "A body"
            }, {
                "title": "Another title",
                "body": "Another body"
            }]);
    });
    it("reset default", () => {
        this.schema().drop("users_default");
        this.schema().drop("posts_default");
        this.schema().drop("countries_default");
    });
    it("migrate default", () => {
        this.schema().create("users_default", table => {
            table.increments("id");
            table.string("email").unique();
            table.unsignedInteger("has_many_through_default_test_country_id");
            table.timestamps();
        });
        this.schema().create("posts_default", table => {
            table.increments("id");
            table.integer("has_many_through_default_test_user_id");
            table.string("title");
            table.text("body");
            table.timestamps();
        });
        this.schema().create("countries_default", table => {
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
export class HasManyThroughTestUser extends Eloquent {
    protected table: any = "users";
    protected guarded: any = [];
    public posts() {
        return this.hasMany(HasManyThroughTestPost, "user_id");
    }
}
/*Eloquent Models...*/
export class HasManyThroughTestPost extends Eloquent {
    protected table: any = "posts";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasManyThroughTestUser, "user_id");
    }
}
export class HasManyThroughTestCountry extends Eloquent {
    protected table: any = "countries";
    protected guarded: any = [];
    public posts() {
        return this.hasManyThrough(HasManyThroughTestPost, HasManyThroughTestUser, "country_id", "user_id");
    }
    public users() {
        return this.hasMany(HasManyThroughTestUser, "country_id");
    }
}
/*Eloquent Models...*/
export class HasManyThroughDefaultTestUser extends Eloquent {
    protected table: any = "users_default";
    protected guarded: any = [];
    public posts() {
        return this.hasMany(HasManyThroughDefaultTestPost);
    }
}
/*Eloquent Models...*/
export class HasManyThroughDefaultTestPost extends Eloquent {
    protected table: any = "posts_default";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasManyThroughDefaultTestUser);
    }
}
export class HasManyThroughDefaultTestCountry extends Eloquent {
    protected table: any = "countries_default";
    protected guarded: any = [];
    public posts() {
        return this.hasManyThrough(HasManyThroughDefaultTestPost, HasManyThroughDefaultTestUser);
    }
    public users() {
        return this.hasMany(HasManyThroughDefaultTestUser);
    }
}
export class HasManyThroughIntermediateTestCountry extends Eloquent {
    protected table: any = "countries";
    protected guarded: any = [];
    public posts() {
        return this.hasManyThrough(HasManyThroughTestPost, HasManyThroughTestUser, "country_short", "email", "shortname", "email");
    }
    public users() {
        return this.hasMany(HasManyThroughTestUser, "country_id");
    }
}
export class HasManyThroughSoftDeletesTestUser extends Eloquent {
    protected table: any = "users";
    protected guarded: any = [];
    public posts() {
        return this.hasMany(HasManyThroughSoftDeletesTestPost, "user_id");
    }
}
/*Eloquent Models...*/
export class HasManyThroughSoftDeletesTestPost extends Eloquent {
    protected table: any = "posts";
    protected guarded: any = [];
    public owner() {
        return this.belongsTo(HasManyThroughSoftDeletesTestUser, "user_id");
    }
}
export class HasManyThroughSoftDeletesTestCountry extends Eloquent {
    protected table: any = "countries";
    protected guarded: any = [];
    public posts() {
        return this.hasManyThrough(HasManyThroughSoftDeletesTestPost, HasManyThroughTestUser, "country_id", "user_id");
    }
    public users() {
        return this.hasMany(HasManyThroughSoftDeletesTestUser, "country_id");
    }
}
