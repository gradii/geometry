import { Manager as DB } from "Illuminate/Database/Capsule/Manager";
import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Scope } from "Illuminate/Database/Eloquent/Scope";
import { Mockery as m } from "Mockery";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent global scopes", () => {
    it("set up", () => {
        super.setUp();
        tap(new DB()).addConnection({
            "driver": "sqlite",
            "database": ":memory:"
        }).bootEloquent();
    });
    it("tear down", () => {
        m.close();
        Model.unsetConnectionResolver();
    });
    it("global scope is applied", () => {
        var model = new EloquentGlobalScopesTestModel();
        var query = model.newQuery();
        expect(query.toSql()).toBe("select * from \"table\" where \"active\" = ?");
        expect(query.getBindings()).toEqual([1]);
    });
    it("global scope can be removed", () => {
        var model = new EloquentGlobalScopesTestModel();
        var query = model.newQuery().withoutGlobalScope(ActiveScope);
        expect(query.toSql()).toBe("select * from \"table\"");
        expect(query.getBindings()).toEqual([]);
    });
    it("closure global scope is applied", () => {
        var model = new EloquentClosureGlobalScopesTestModel();
        var query = model.newQuery();
        expect(query.toSql()).toBe("select * from \"table\" where \"active\" = ? order by \"name\" asc");
        expect(query.getBindings()).toEqual([1]);
    });
    it("closure global scope can be removed", () => {
        var model = new EloquentClosureGlobalScopesTestModel();
        var query = model.newQuery().withoutGlobalScope("active_scope");
        expect(query.toSql()).toBe("select * from \"table\" order by \"name\" asc");
        expect(query.getBindings()).toEqual([]);
    });
    it("global scope can be removed after the query is executed", () => {
        var model = new EloquentClosureGlobalScopesTestModel();
        var query = model.newQuery();
        expect(query.toSql()).toBe("select * from \"table\" where \"active\" = ? order by \"name\" asc");
        expect(query.getBindings()).toEqual([1]);
        query.withoutGlobalScope("active_scope");
        expect(query.toSql()).toBe("select * from \"table\" order by \"name\" asc");
        expect(query.getBindings()).toEqual([]);
    });
    it("all global scopes can be removed", () => {
        var model = new EloquentClosureGlobalScopesTestModel();
        var query = model.newQuery().withoutGlobalScopes();
        expect(query.toSql()).toBe("select * from \"table\"");
        expect(query.getBindings()).toEqual([]);
        var query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes();
        expect(query.toSql()).toBe("select * from \"table\"");
        expect(query.getBindings()).toEqual([]);
    });
    it("global scopes with or where conditions are nested", () => {
        var model = new EloquentClosureGlobalScopesWithOrTestModel();
        var query = model.newQuery();
        expect(query.toSql()).toBe("select \"email\", \"password\" from \"table\" where (\"email\" = ? or \"email\" = ?) and \"active\" = ? order by \"name\" asc");
        expect(query.getBindings()).toEqual(["taylor@gmail.com", "someone@else.com", 1]);
        var query = model.newQuery().where("col1", "val1").orWhere("col2", "val2");
        expect(query.toSql()).toBe("select \"email\", \"password\" from \"table\" where (\"col1\" = ? or \"col2\" = ?) and (\"email\" = ? or \"email\" = ?) and \"active\" = ? order by \"name\" asc");
        expect(query.getBindings()).toEqual(["val1", "val2", "taylor@gmail.com", "someone@else.com", 1]);
    });
    it("regular scopes with or where conditions are nested", () => {
        var query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes().where("foo", "foo").orWhere("bar", "bar").approved();
        expect(query.toSql()).toBe("select * from \"table\" where (\"foo\" = ? or \"bar\" = ?) and (\"approved\" = ? or \"should_approve\" = ?)");
        expect(query.getBindings()).toEqual(["foo", "bar", 1, 0]);
    });
    it("scopes starting with or boolean are preserved", () => {
        var query = EloquentClosureGlobalScopesTestModel.withoutGlobalScopes().where("foo", "foo").orWhere("bar", "bar").orApproved();
        expect(query.toSql()).toBe("select * from \"table\" where (\"foo\" = ? or \"bar\" = ?) or (\"approved\" = ? or \"should_approve\" = ?)");
        expect(query.getBindings()).toEqual(["foo", "bar", 1, 0]);
    });
    it("has query where both models have global scopes", () => {
        var query = EloquentGlobalScopesWithRelationModel.has("related").where("bar", "baz");
        var subQuery = "select * from \"table\" where \"table2\".\"id\" = \"table\".\"related_id\" and \"foo\" = ? and \"active\" = ?";
        var mainQuery = "select * from \"table2\" where exists (" + subQuery + ") and \"bar\" = ? and \"active\" = ? order by \"name\" asc";
        expect(query.toSql()).toEqual(mainQuery);
        expect(query.getBindings()).toEqual(["bar", 1, "baz", 1]);
    });
});
export class EloquentClosureGlobalScopesTestModel extends Model {
    protected table: any = "table";
    public static boot() {
        EloquentClosureGlobalScopesTestModel.addGlobalScope(query => {
            query.orderBy("name");
        });
        EloquentClosureGlobalScopesTestModel.addGlobalScope("active_scope", query => {
            query.where("active", 1);
        });
        super.boot();
    }
    public scopeApproved(query) {
        return query.where("approved", 1).orWhere("should_approve", 0);
    }
    public scopeOrApproved(query) {
        return query.orWhere("approved", 1).orWhere("should_approve", 0);
    }
}
export class EloquentGlobalScopesWithRelationModel extends EloquentClosureGlobalScopesTestModel {
    protected table: any = "table2";
    public related() {
        return this.hasMany(EloquentGlobalScopesTestModel, "related_id").where("foo", "bar");
    }
}
export class EloquentClosureGlobalScopesWithOrTestModel extends EloquentClosureGlobalScopesTestModel {
    public static boot() {
        EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope("or_scope", query => {
            query.where("email", "taylor@gmail.com").orWhere("email", "someone@else.com");
        });
        EloquentClosureGlobalScopesWithOrTestModel.addGlobalScope(query => {
            query.select("email", "password");
        });
        super.boot();
    }
}
export class EloquentGlobalScopesTestModel extends Model {
    protected table: any = "table";
    public static boot() {
        EloquentGlobalScopesTestModel.addGlobalScope(new ActiveScope());
        super.boot();
    }
}
export class ActiveScope implements Scope {
    public apply(builder, model) {
        return builder.where("active", 1);
    }
}
