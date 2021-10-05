import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { HasOne } from "Illuminate/Database/Eloquent/Relations/HasOne";
import { Builder as BaseBuilder } from "Illuminate/Database/Query/Builder";
import { Expression } from "Illuminate/Database/Query/Expression";
import { Mockery as m } from "Mockery";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent has one", () => {
    it("tear down", () => {
        m.close();
    });
    it("has one with default", () => {
        var relation = this.getRelation().withDefault();
        this.builder.shouldReceive("first").once().andReturnNull();
        var newModel = new EloquentHasOneModelStub();
        this.related.shouldReceive("newInstance").once().andReturn(newModel);
        expect(relation.getResults()).toEqual(newModel);
        expect(newModel.getAttribute("foreign_key")).toEqual(1);
    });
    it("has one with dynamic default", () => {
        var relation = this.getRelation().withDefault(newModel => {
            newModel.username = "taylor";
        });
        this.builder.shouldReceive("first").once().andReturnNull();
        var newModel = new EloquentHasOneModelStub();
        this.related.shouldReceive("newInstance").once().andReturn(newModel);
        expect(relation.getResults()).toEqual(newModel);
        expect(newModel.username).toBe("taylor");
        expect(newModel.getAttribute("foreign_key")).toEqual(1);
    });
    it("has one with dynamic default use parent model", () => {
        var relation = this.getRelation().withDefault((newModel, parentModel) => {
            newModel.username = parentModel.username;
        });
        this.builder.shouldReceive("first").once().andReturnNull();
        var newModel = new EloquentHasOneModelStub();
        this.related.shouldReceive("newInstance").once().andReturn(newModel);
        expect(relation.getResults()).toEqual(newModel);
        expect(newModel.username).toBe("taylor");
        expect(newModel.getAttribute("foreign_key")).toEqual(1);
    });
    it("has one with array default", () => {
        var attributes = {
            "username": "taylor"
        };
        var relation = this.getRelation().withDefault(attributes);
        this.builder.shouldReceive("first").once().andReturnNull();
        var newModel = new EloquentHasOneModelStub();
        this.related.shouldReceive("newInstance").once().andReturn(newModel);
        expect(relation.getResults()).toEqual(newModel);
        expect(newModel.username).toBe("taylor");
        expect(newModel.getAttribute("foreign_key")).toEqual(1);
    });
    it("make method does not save new model", () => {
        var relation = this.getRelation();
        var instance = this.getMockBuilder(Model).setMethods(["save", "newInstance", "setAttribute"]).getMock();
        relation.getRelated().shouldReceive("newInstance")._with({
            "name": "taylor"
        }).andReturn(instance);
        instance.expects(this.once()).method("setAttribute")._with("foreign_key", 1);
        instance.expects(this.never()).method("save");
        expect(relation.make({
            "name": "taylor"
        })).toEqual(instance);
    });
    it("save method sets foreign key on model", () => {
        var relation = this.getRelation();
        var mockModel = this.getMockBuilder(Model).setMethods(["save"]).getMock();
        mockModel.expects(this.once()).method("save").willReturn(true);
        var result = relation.save(mockModel);
        var attributes = result.getAttributes();
        expect(attributes["foreign_key"]).toEqual(1);
    });
    it("create method properly creates new model", () => {
        var relation = this.getRelation();
        var created = this.getMockBuilder(Model).setMethods(["save", "getKey", "setAttribute"]).getMock();
        created.expects(this.once()).method("save").willReturn(true);
        relation.getRelated().shouldReceive("newInstance").once()._with({
            "name": "taylor"
        }).andReturn(created);
        created.expects(this.once()).method("setAttribute")._with("foreign_key", 1);
        expect(relation.create({
            "name": "taylor"
        })).toEqual(created);
    });
    it("relation is properly initialized", () => {
        var relation = this.getRelation();
        var model = m.mock(Model);
        model.shouldReceive("setRelation").once()._with("foo", null);
        var models = relation.initRelation([model], "foo");
        expect(models).toEqual([model]);
    });
    it("eager constraints are properly added", () => {
        var relation = this.getRelation();
        relation.getParent().shouldReceive("getKeyName").once().andReturn("id");
        relation.getParent().shouldReceive("getKeyType").once().andReturn("int");
        relation.getQuery().shouldReceive("whereIntegerInRaw").once()._with("table.foreign_key", [1, 2]);
        var model1 = new EloquentHasOneModelStub();
        model1.id = 1;
        var model2 = new EloquentHasOneModelStub();
        model2.id = 2;
        relation.addEagerConstraints([model1, model2]);
    });
    it("models are properly matched to parents", () => {
        var relation = this.getRelation();
        var result1 = new EloquentHasOneModelStub();
        result1.foreign_key = 1;
        var result2 = new EloquentHasOneModelStub();
        result2.foreign_key = 2;
        var model1 = new EloquentHasOneModelStub();
        model1.id = 1;
        var model2 = new EloquentHasOneModelStub();
        model2.id = 2;
        var model3 = new EloquentHasOneModelStub();
        model3.id = 3;
        var models = relation.match([model1, model2, model3], new Collection([result1, result2]), "foo");
        expect(models[0].foo.foreign_key).toEqual(1);
        expect(models[1].foo.foreign_key).toEqual(2);
        expect(models[2].foo).toNull();
    });
    it("relation count query can be built", () => {
        var relation = this.getRelation();
        var builder = m.mock(Builder);
        var baseQuery = m.mock(BaseBuilder);
        baseQuery.from = "one";
        var parentQuery = m.mock(BaseBuilder);
        parentQuery.from = "two";
        builder.shouldReceive("getQuery").once().andReturn(baseQuery);
        builder.shouldReceive("getQuery").once().andReturn(parentQuery);
        builder.shouldReceive("select").once()._with(m.type(Expression)).andReturnSelf();
        relation.getParent().shouldReceive("qualifyColumn").andReturn("table.id");
        builder.shouldReceive("whereColumn").once()._with("table.id", "=", "table.foreign_key").andReturn(baseQuery);
        baseQuery.shouldReceive("setBindings").once()._with([], "select");
        relation.getRelationExistenceCountQuery(builder, builder);
    });
    it("get relation", () => {
        this.builder = m.mock(Builder);
        this.builder.shouldReceive("whereNotNull")._with("table.foreign_key");
        this.builder.shouldReceive("where")._with("table.foreign_key", "=", 1);
        this.related = m.mock(Model);
        this.builder.shouldReceive("getModel").andReturn(this.related);
        this.parent = m.mock(Model);
        this.parent.shouldReceive("getAttribute")._with("id").andReturn(1);
        this.parent.shouldReceive("getAttribute")._with("username").andReturn("taylor");
        this.parent.shouldReceive("getCreatedAtColumn").andReturn("created_at");
        this.parent.shouldReceive("getUpdatedAtColumn").andReturn("updated_at");
        this.parent.shouldReceive("newQueryWithoutScopes").andReturn(this.builder);
        return new HasOne(this.builder, this.parent, "table.foreign_key", "id");
    });
});
export class EloquentHasOneModelStub extends Model {
    public foreign_key: any = "foreign.value";
}
