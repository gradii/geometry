import { DateTime } from "DateTime";
import { DateTimeImmutable } from "DateTimeImmutable";
import { DateTimeInterface } from "DateTimeInterface";
import { Exception } from "Exception";
import { EloquentModelNamespacedStub } from "Foo/Bar/EloquentModelNamespacedStub";
import { CastsInboundAttributes } from "Illuminate/Contracts/Database/Eloquent/CastsInboundAttributes";
import { Dispatcher } from "Illuminate/Contracts/Events/Dispatcher";
import { Connection } from "Illuminate/Database/Connection";
import { ConnectionResolverInterface } from "Illuminate/Database/ConnectionResolverInterface";
import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { JsonEncodingException } from "Illuminate/Database/Eloquent/JsonEncodingException";
import { MassAssignmentException } from "Illuminate/Database/Eloquent/MassAssignmentException";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { BelongsTo } from "Illuminate/Database/Eloquent/Relations/BelongsTo";
import { Relation } from "Illuminate/Database/Eloquent/Relations/Relation";
import { Builder as BaseBuilder } from "Illuminate/Database/Query/Builder";
import { Grammar } from "Illuminate/Database/Query/Grammars/Grammar";
import { Processor } from "Illuminate/Database/Query/Processors/Processor";
import { Carbon } from "Illuminate/Support/Carbon";
import { Collection as BaseCollection } from "Illuminate/Support/Collection";
import { InteractsWithTime } from "Illuminate/Support/InteractsWithTime";
import { InvalidArgumentException } from "InvalidArgumentException";
import { LogicException } from "LogicException";
import { Mockery as m } from "Mockery";
import { TestCase } from "PHPUnit/Framework/TestCase";
import { ReflectionClass } from "ReflectionClass";
import { stdClass } from "stdClass";
describe("test database eloquent model", () => {
    it("set up", () => {
        super.setUp();
        Carbon.setTestNow(Carbon.now());
    });
    it("tear down", () => {
        super.tearDown();
        m.close();
        Carbon.setTestNow(null);
        Model.unsetEventDispatcher();
        Carbon.resetToStringFormat();
    });
    it("attribute manipulation", () => {
        var model = new EloquentModelStub();
        model.name = "foo";
        expect(model.name).toBe("foo");
        expect(model.name !== undefined).toBeTruthy();
        delete model.name;
        expect(model.name !== undefined).toFalse();
        model.list_items = {
            "name": "taylor"
        };
        expect(model.list_items).toEqual({
            "name": "taylor"
        });
        var attributes = model.getAttributes();
        expect(attributes["list_items"]).toEqual(json_encode({
            "name": "taylor"
        }));
    });
    it("set attribute with numeric key", () => {
        var model = new EloquentDateModelStub();
        model.setAttribute(0, "value");
        expect(model.getAttributes()).toEqual({
            0: "value"
        });
    });
    it("dirty attributes", () => {
        var model = new EloquentModelStub({
            "foo": "1",
            "bar": 2,
            "baz": 3
        });
        model.syncOriginal();
        model.foo = 1;
        model.bar = 20;
        model.baz = 30;
        expect(model.isDirty()).toBeTruthy();
        expect(model.isDirty("foo")).toFalse();
        expect(model.isDirty("bar")).toBeTruthy();
        expect(model.isDirty("foo", "bar")).toBeTruthy();
        expect(model.isDirty(["foo", "bar"])).toBeTruthy();
    });
    it("int and null comparison when dirty", () => {
        var model = new EloquentModelCastingStub();
        model.intAttribute = null;
        model.syncOriginal();
        expect(model.isDirty("intAttribute")).toFalse();
        model.forceFill({
            "intAttribute": 0
        });
        expect(model.isDirty("intAttribute")).toBeTruthy();
    });
    it("float and null comparison when dirty", () => {
        var model = new EloquentModelCastingStub();
        model.floatAttribute = null;
        model.syncOriginal();
        expect(model.isDirty("floatAttribute")).toFalse();
        model.forceFill({
            "floatAttribute": 0
        });
        expect(model.isDirty("floatAttribute")).toBeTruthy();
    });
    it("dirty on cast or date attributes", () => {
        var model = new EloquentModelCastingStub();
        model.setDateFormat("Y-m-d H:i:s");
        model.boolAttribute = 1;
        model.foo = 1;
        model.bar = "2017-03-18";
        model.dateAttribute = "2017-03-18";
        model.datetimeAttribute = "2017-03-23 22:17:00";
        model.syncOriginal();
        model.boolAttribute = true;
        model.foo = true;
        model.bar = "2017-03-18 00:00:00";
        model.dateAttribute = "2017-03-18 00:00:00";
        model.datetimeAttribute = null;
        expect(model.isDirty()).toBeTruthy();
        expect(model.isDirty("foo")).toBeTruthy();
        expect(model.isDirty("bar")).toBeTruthy();
        expect(model.isDirty("boolAttribute")).toFalse();
        expect(model.isDirty("dateAttribute")).toFalse();
        expect(model.isDirty("datetimeAttribute")).toBeTruthy();
    });
    it("dirty on casted objects", () => {
        var model = new EloquentModelCastingStub();
        model.setRawAttributes({
            "objectAttribute": "[\"one\", \"two\", \"three\"]",
            "collectionAttribute": "[\"one\", \"two\", \"three\"]"
        });
        model.syncOriginal();
        model.objectAttribute = ["one", "two", "three"];
        model.collectionAttribute = ["one", "two", "three"];
        expect(model.isDirty()).toFalse();
        expect(model.isDirty("objectAttribute")).toFalse();
        expect(model.isDirty("collectionAttribute")).toFalse();
    });
    it("clean attributes", () => {
        var model = new EloquentModelStub({
            "foo": "1",
            "bar": 2,
            "baz": 3
        });
        model.syncOriginal();
        model.foo = 1;
        model.bar = 20;
        model.baz = 30;
        expect(model.isClean()).toFalse();
        expect(model.isClean("foo")).toBeTruthy();
        expect(model.isClean("bar")).toFalse();
        expect(model.isClean("foo", "bar")).toFalse();
        expect(model.isClean(["foo", "bar"])).toFalse();
    });
    it("clean when float update attribute", () => {
        var model = new EloquentModelStub({
            "castedFloat": 8 - 6.4
        });
        model.syncOriginal();
        model.castedFloat = 1.6;
        expect(model.originalIsEquivalent("castedFloat")).toBeTruthy();
        var model = new EloquentModelStub({
            "castedFloat": 5.6
        });
        model.syncOriginal();
        model.castedFloat = 5.5;
        expect(model.originalIsEquivalent("castedFloat")).toFalse();
    });
    it("calculated attributes", () => {
        var model = new EloquentModelStub();
        model.password = "secret";
        var attributes = model.getAttributes();
        expect(attributes).toArrayNotHasKey("password");
        expect(model.password).toBe("******");
        var hash = "e5e9fa1ba31ecd1ae84f75caaa474f3a663f05f4";
        expect(attributes["password_hash"]).toEqual(hash);
        expect(model.password_hash).toEqual(hash);
    });
    it("array access to attributes", () => {
        var model = new EloquentModelStub({
            "attributes": 1,
            "connection": 2,
            "table": 3
        });
        delete model["table"];
        expect(model["attributes"] !== undefined).toBeTruthy();
        expect(1).toEqual(model["attributes"]);
        expect(model["connection"] !== undefined).toBeTruthy();
        expect(2).toEqual(model["connection"]);
        expect(model["table"] !== undefined).toFalse();
        expect(null).toEqual(model["table"]);
        expect(model["with"] !== undefined).toFalse();
    });
    it("only", () => {
        var model = new EloquentModelStub();
        model.first_name = "taylor";
        model.last_name = "otwell";
        model.project = "laravel";
        expect(model.only("project")).toEqual({
            "project": "laravel"
        });
        expect(model.only("first_name", "last_name")).toEqual({
            "first_name": "taylor",
            "last_name": "otwell"
        });
        expect(model.only(["first_name", "last_name"])).toEqual({
            "first_name": "taylor",
            "last_name": "otwell"
        });
    });
    it("new instance returns new instance with attributes set", () => {
        var model = new EloquentModelStub();
        var instance = model.newInstance({
            "name": "taylor"
        });
        expect(instance).toInstanceOf(EloquentModelStub);
        expect(instance.name).toBe("taylor");
    });
    it("new instance returns new instance with table set", () => {
        var model = new EloquentModelStub();
        model.setTable("test");
        var newInstance = model.newInstance();
        expect(newInstance.getTable()).toBe("test");
    });
    it("new instance returns new instance with merged casts", () => {
        var model = new EloquentModelStub();
        model.mergeCasts({
            "foo": "date"
        });
        var newInstance = model.newInstance();
        expect(newInstance.getCasts()).toArrayHasKey("foo");
        expect(newInstance.getCasts()["foo"]).toBe("date");
    });
    it("create method saves new model", () => {
        _SERVER["__eloquent.saved"] = false;
        var model = EloquentModelSaveStub.create({
            "name": "taylor"
        });
        expect(_SERVER["__eloquent.saved"]).toBeTruthy();
        expect(model.name).toBe("taylor");
    });
    it("make method does not save new model", () => {
        _SERVER["__eloquent.saved"] = false;
        var model = EloquentModelSaveStub.make({
            "name": "taylor"
        });
        expect(_SERVER["__eloquent.saved"]).toFalse();
        expect(model.name).toBe("taylor");
    });
    it("force create method saves new model with guarded attributes", () => {
        _SERVER["__eloquent.saved"] = false;
        var model = EloquentModelSaveStub.forceCreate({
            "id": 21
        });
        expect(_SERVER["__eloquent.saved"]).toBeTruthy();
        expect(model.id).toEqual(21);
    });
    it("find method use write pdo", () => {
        EloquentModelFindWithWritePdoStub.onWriteConnection().find(1);
    });
    it("destroy method calls query builder correctly", () => {
        EloquentModelDestroyStub.destroy(1, 2, 3);
    });
    it("destroy method calls query builder correctly with collection", () => {
        EloquentModelDestroyStub.destroy(new Collection([1, 2, 3]));
    });
    it("with method calls query builder correctly", () => {
        var result = EloquentModelWithStub._with("foo", "bar");
        expect(result).toBe("foo");
    });
    it("without method removes eager loaded relationship correctly", () => {
        var model = new EloquentModelWithoutRelationStub();
        this.addMockConnection(model);
        var instance = model.newInstance().newQuery().without("foo");
        expect(instance.getEagerLoads()).toEmpty();
    });
    it("eager loading with columns", () => {
        var model = new EloquentModelWithoutRelationStub();
        var instance = model.newInstance().newQuery()._with("foo:bar,baz", "hadi");
        var builder = m.mock(Builder);
        builder.shouldReceive("select").once()._with(["bar", "baz"]);
        expect(instance.getEagerLoads()["hadi"]).toNotNull();
        expect(instance.getEagerLoads()["foo"]).toNotNull();
        var closure = instance.getEagerLoads()["foo"];
        closure(builder);
    });
    it("with method calls query builder correctly with array", () => {
        var result = EloquentModelWithStub._with(["foo", "bar"]);
        expect(result).toBe("foo");
    });
    it("update process", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("where").once()._with("id", "=", 1);
        query.shouldReceive("update").once()._with({
            "name": "taylor"
        }).andReturn(1);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.updating: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.updated: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.saved: " + get_class(model), model).andReturn(true);
        model.id = 1;
        model.foo = "bar";
        model.syncOriginal();
        model.name = "taylor";
        model.exists = true;
        expect(model.save()).toBeTruthy();
    });
    it("update process doesnt override timestamps", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("where").once()._with("id", "=", 1);
        query.shouldReceive("update").once()._with({
            "created_at": "foo",
            "updated_at": "bar"
        }).andReturn(1);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until");
        events.shouldReceive("dispatch");
        model.id = 1;
        model.syncOriginal();
        model.created_at = "foo";
        model.updated_at = "bar";
        model.exists = true;
        expect(model.save()).toBeTruthy();
    });
    it("save is canceled if saving event returns false", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery"]).getMock();
        var query = m.mock(Builder);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(false);
        model.exists = true;
        expect(model.save()).toFalse();
    });
    it("update is canceled if updating event returns false", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery"]).getMock();
        var query = m.mock(Builder);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.updating: " + get_class(model), model).andReturn(false);
        model.exists = true;
        model.foo = "bar";
        expect(model.save()).toFalse();
    });
    it("events can be fired with custom event objects", () => {
        var model = this.getMockBuilder(EloquentModelEventObjectStub).setMethods(["newModelQuery"]).getMock();
        var query = m.mock(Builder);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with(m.type(EloquentModelSavingEventStub)).andReturn(false);
        model.exists = true;
        expect(model.save()).toFalse();
    });
    it("update process without timestamps", () => {
        var model = this.getMockBuilder(EloquentModelEventObjectStub).setMethods(["newModelQuery", "updateTimestamps", "fireModelEvent"]).getMock();
        model.timestamps = false;
        var query = m.mock(Builder);
        query.shouldReceive("where").once()._with("id", "=", 1);
        query.shouldReceive("update").once()._with({
            "name": "taylor"
        }).andReturn(1);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.never()).method("updateTimestamps");
        model.expects(this.any()).method("fireModelEvent").willReturn(true);
        model.id = 1;
        model.syncOriginal();
        model.name = "taylor";
        model.exists = true;
        expect(model.save()).toBeTruthy();
    });
    it("update uses old primary key", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("where").once()._with("id", "=", 1);
        query.shouldReceive("update").once()._with({
            "id": 2,
            "foo": "bar"
        }).andReturn(1);
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.updating: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.updated: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.saved: " + get_class(model), model).andReturn(true);
        model.id = 1;
        model.syncOriginal();
        model.id = 2;
        model.foo = "bar";
        model.exists = true;
        expect(model.save()).toBeTruthy();
    });
    it("timestamps are returned as objects", () => {
        var model = this.getMockBuilder(EloquentDateModelStub).setMethods(["getDateFormat"]).getMock();
        model.expects(this.any()).method("getDateFormat").willReturn("Y-m-d");
        model.setRawAttributes({
            "created_at": "2012-12-04",
            "updated_at": "2012-12-05"
        });
        expect(model.created_at).toInstanceOf(Carbon);
        expect(model.updated_at).toInstanceOf(Carbon);
    });
    it("timestamps are returned as objects from plain dates and timestamps", () => {
        var model = this.getMockBuilder(EloquentDateModelStub).setMethods(["getDateFormat"]).getMock();
        model.expects(this.any()).method("getDateFormat").willReturn("Y-m-d H:i:s");
        model.setRawAttributes({
            "created_at": "2012-12-04",
            "updated_at": this.currentTime()
        });
        expect(model.created_at).toInstanceOf(Carbon);
        expect(model.updated_at).toInstanceOf(Carbon);
    });
    it("timestamps are returned as objects on create", () => {
        var timestamps = {
            "created_at": Carbon.now(),
            "updated_at": Carbon.now()
        };
        var model = new EloquentDateModelStub();
        Model.setConnectionResolver(resolver = m.mock(ConnectionResolverInterface));
        resolver.shouldReceive("connection").andReturn(mockConnection = m.mock(stdClass));
        mockConnection.shouldReceive("getQueryGrammar").andReturn(mockConnection);
        mockConnection.shouldReceive("getDateFormat").andReturn("Y-m-d H:i:s");
        var instance = model.newInstance(timestamps);
        expect(instance.updated_at).toInstanceOf(Carbon);
        expect(instance.created_at).toInstanceOf(Carbon);
    });
    it("date time attributes return null if set to null", () => {
        var timestamps = {
            "created_at": Carbon.now(),
            "updated_at": Carbon.now()
        };
        var model = new EloquentDateModelStub();
        Model.setConnectionResolver(resolver = m.mock(ConnectionResolverInterface));
        resolver.shouldReceive("connection").andReturn(mockConnection = m.mock(stdClass));
        mockConnection.shouldReceive("getQueryGrammar").andReturn(mockConnection);
        mockConnection.shouldReceive("getDateFormat").andReturn("Y-m-d H:i:s");
        var instance = model.newInstance(timestamps);
        instance.created_at = null;
        expect(instance.created_at).toNull();
    });
    it("timestamps are created from strings and integers", () => {
        var model = new EloquentDateModelStub();
        model.created_at = "2013-05-22 00:00:00";
        expect(model.created_at).toInstanceOf(Carbon);
        var model = new EloquentDateModelStub();
        model.created_at = this.currentTime();
        expect(model.created_at).toInstanceOf(Carbon);
        var model = new EloquentDateModelStub();
        model.created_at = 0;
        expect(model.created_at).toInstanceOf(Carbon);
        var model = new EloquentDateModelStub();
        model.created_at = "2012-01-01";
        expect(model.created_at).toInstanceOf(Carbon);
    });
    it("from date time", () => {
        var model = new EloquentModelStub();
        var value = Carbon.parse("2015-04-17 22:59:01");
        expect(model.fromDateTime(value)).toBe("2015-04-17 22:59:01");
        var value = new DateTime("2015-04-17 22:59:01");
        expect(value).toInstanceOf(DateTime);
        expect(value).toInstanceOf(DateTimeInterface);
        expect(model.fromDateTime(value)).toBe("2015-04-17 22:59:01");
        var value = new DateTimeImmutable("2015-04-17 22:59:01");
        expect(value).toInstanceOf(DateTimeImmutable);
        expect(value).toInstanceOf(DateTimeInterface);
        expect(model.fromDateTime(value)).toBe("2015-04-17 22:59:01");
        var value = "2015-04-17 22:59:01";
        expect(model.fromDateTime(value)).toBe("2015-04-17 22:59:01");
        var value = "2015-04-17";
        expect(model.fromDateTime(value)).toBe("2015-04-17 00:00:00");
        var value = "2015-4-17";
        expect(model.fromDateTime(value)).toBe("2015-04-17 00:00:00");
        var value = "1429311541";
        expect(model.fromDateTime(value)).toBe("2015-04-17 22:59:01");
        expect(model.fromDateTime(null)).toNull();
    });
    it("from date time milliseconds", () => {
        if (version_compare(PHP_VERSION, "7.3.0-dev", "<")) {
            this.markTestSkipped("Due to https://bugs.php.net/bug.php?id=75577, proper \"v\" format support can only works since PHP 7.3.");
        }
        var model = this.getMockBuilder("Illuminate\\Tests\\Database\\EloquentDateModelStub").setMethods(["getDateFormat"]).getMock();
        model.expects(this.any()).method("getDateFormat").willReturn("Y-m-d H:s.vi");
        model.setRawAttributes({
            "created_at": "2012-12-04 22:59.32130"
        });
        expect(model.created_at).toInstanceOf(Carbon);
        expect(model.created_at.format("H:i:s.u")).toBe("22:30:59.321000");
    });
    it("insert process", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.creating: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.created: " + get_class(model), model);
        events.shouldReceive("dispatch").once()._with("eloquent.saved: " + get_class(model), model);
        model.name = "taylor";
        model.exists = false;
        expect(model.save()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insert").once()._with({
            "name": "taylor"
        });
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.setIncrementing(false);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.creating: " + get_class(model), model).andReturn(true);
        events.shouldReceive("dispatch").once()._with("eloquent.created: " + get_class(model), model);
        events.shouldReceive("dispatch").once()._with("eloquent.saved: " + get_class(model), model);
        model.name = "taylor";
        model.exists = false;
        expect(model.save()).toBeTruthy();
        expect(model.id).toNull();
        expect(model.exists).toBeTruthy();
    });
    it("insert is canceled if creating event returns false", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("until").once()._with("eloquent.saving: " + get_class(model), model).andReturn(true);
        events.shouldReceive("until").once()._with("eloquent.creating: " + get_class(model), model).andReturn(false);
        expect(model.save()).toFalse();
        expect(model.exists).toFalse();
    });
    it("delete properly deletes model", () => {
        var model = this.getMockBuilder(Model).setMethods(["newModelQuery", "updateTimestamps", "touchOwners"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("where").once()._with("id", "=", 1).andReturn(query);
        query.shouldReceive("delete").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("touchOwners");
        model.exists = true;
        model.id = 1;
        model.delete();
    });
    it("push no relations", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.name = "taylor";
        model.exists = false;
        expect(model.push()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
    });
    it("push empty one relation", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.name = "taylor";
        model.exists = false;
        model.setRelation("relationOne", null);
        expect(model.push()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
        expect(model.relationOne).toNull();
    });
    it("push one relation", () => {
        var related1 = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "related1"
        }, "id").andReturn(2);
        query.shouldReceive("getConnection").once();
        related1.expects(this.once()).method("newModelQuery").willReturn(query);
        related1.expects(this.once()).method("updateTimestamps");
        related1.name = "related1";
        related1.exists = false;
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.name = "taylor";
        model.exists = false;
        model.setRelation("relationOne", related1);
        expect(model.push()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
        expect(model.relationOne.id).toEqual(2);
        expect(model.relationOne.exists).toBeTruthy();
        expect(related1.id).toEqual(2);
        expect(related1.exists).toBeTruthy();
    });
    it("push empty many relation", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.name = "taylor";
        model.exists = false;
        model.setRelation("relationMany", new Collection([]));
        expect(model.push()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
        expect(model.relationMany).toCount(0);
    });
    it("push many relation", () => {
        var related1 = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "related1"
        }, "id").andReturn(2);
        query.shouldReceive("getConnection").once();
        related1.expects(this.once()).method("newModelQuery").willReturn(query);
        related1.expects(this.once()).method("updateTimestamps");
        related1.name = "related1";
        related1.exists = false;
        var related2 = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "related2"
        }, "id").andReturn(3);
        query.shouldReceive("getConnection").once();
        related2.expects(this.once()).method("newModelQuery").willReturn(query);
        related2.expects(this.once()).method("updateTimestamps");
        related2.name = "related2";
        related2.exists = false;
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with({
            "name": "taylor"
        }, "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        model.expects(this.once()).method("updateTimestamps");
        model.name = "taylor";
        model.exists = false;
        model.setRelation("relationMany", new Collection([related1, related2]));
        expect(model.push()).toBeTruthy();
        expect(model.id).toEqual(1);
        expect(model.exists).toBeTruthy();
        expect(model.relationMany).toCount(2);
        expect(model.relationMany.pluck("id").all()).toEqual([2, 3]);
    });
    it("new query returns eloquent query builder", () => {
        var conn = m.mock(Connection);
        var grammar = m.mock(Grammar);
        var processor = m.mock(Processor);
        EloquentModelStub.setConnectionResolver(resolver = m.mock(ConnectionResolverInterface));
        conn.shouldReceive("query").andReturnUsing(() => {
            return new BaseBuilder(conn, grammar, processor);
        });
        resolver.shouldReceive("connection").andReturn(conn);
        var model = new EloquentModelStub();
        var builder = model.newQuery();
        expect(builder).toInstanceOf(Builder);
    });
    it("get and set table operations", () => {
        var model = new EloquentModelStub();
        expect(model.getTable()).toBe("stub");
        model.setTable("foo");
        expect(model.getTable()).toBe("foo");
    });
    it("get key returns value of primary key", () => {
        var model = new EloquentModelStub();
        model.id = 1;
        expect(model.getKey()).toEqual(1);
        expect(model.getKeyName()).toBe("id");
    });
    it("connection management", () => {
        EloquentModelStub.setConnectionResolver(resolver = m.mock(ConnectionResolverInterface));
        var model = m.mock(EloquentModelStub + "[getConnectionName,connection]");
        var retval = model.setConnection("foo");
        expect(model).toEqual(retval);
        expect(model.connection).toBe("foo");
        model.shouldReceive("getConnectionName").once().andReturn("somethingElse");
        resolver.shouldReceive("connection").once()._with("somethingElse").andReturn("bar");
        expect(model.getConnection()).toBe("bar");
    });
    it("to array", () => {
        var model = new EloquentModelStub();
        model.name = "foo";
        model.age = null;
        model.password = "password1";
        model.setHidden(["password"]);
        model.setRelation("names", new BaseCollection([new EloquentModelStub({
                "bar": "baz"
            }), new EloquentModelStub({
                "bam": "boom"
            })]));
        model.setRelation("partner", new EloquentModelStub({
            "name": "abby"
        }));
        model.setRelation("group", null);
        model.setRelation("multi", new BaseCollection());
        var array = model.toArray();
        expect(array).toIsArray();
        expect(array["name"]).toBe("foo");
        expect(array["names"][0]["bar"]).toBe("baz");
        expect(array["names"][1]["bam"]).toBe("boom");
        expect(array["partner"]["name"]).toBe("abby");
        expect(array["group"]).toNull();
        expect(array["multi"]).toEqual([]);
        expect(array["password"] !== undefined).toFalse();
        model.setAppends(["appendable"]);
        var array = model.toArray();
        expect(array["appendable"]).toBe("appended");
    });
    it("visible creates array whitelist", () => {
        var model = new EloquentModelStub();
        model.setVisible(["name"]);
        model.name = "Taylor";
        model.age = 26;
        var array = model.toArray();
        expect(array).toEqual({
            "name": "Taylor"
        });
    });
    it("hidden can also exclude relationships", () => {
        var model = new EloquentModelStub();
        model.name = "Taylor";
        model.setRelation("foo", ["bar"]);
        model.setHidden(["foo", "list_items", "password"]);
        var array = model.toArray();
        expect(array).toEqual({
            "name": "Taylor"
        });
    });
    it("get arrayable relations function exclude hidden relationships", () => {
        var model = new EloquentModelStub();
        var clazz = new ReflectionClass(model);
        var method = clazz.getMethod("getArrayableRelations");
        method.setAccessible(true);
        model.setRelation("foo", ["bar"]);
        model.setRelation("bam", ["boom"]);
        model.setHidden(["foo"]);
        var array = method.invokeArgs(model, []);
        expect(array).toEqual({
            "bam": ["boom"]
        });
    });
    it("to array snake attributes", () => {
        var model = new EloquentModelStub();
        model.setRelation("namesList", new BaseCollection([new EloquentModelStub({
                "bar": "baz"
            }), new EloquentModelStub({
                "bam": "boom"
            })]));
        var array = model.toArray();
        expect(array["names_list"][0]["bar"]).toBe("baz");
        expect(array["names_list"][1]["bam"]).toBe("boom");
        var model = new EloquentModelCamelStub();
        model.setRelation("namesList", new BaseCollection([new EloquentModelStub({
                "bar": "baz"
            }), new EloquentModelStub({
                "bam": "boom"
            })]));
        var array = model.toArray();
        expect(array["namesList"][0]["bar"]).toBe("baz");
        expect(array["namesList"][1]["bam"]).toBe("boom");
    });
    it("to array uses mutators", () => {
        var model = new EloquentModelStub();
        model.list_items = [1, 2, 3];
        var array = model.toArray();
        expect(array["list_items"]).toEqual([1, 2, 3]);
    });
    it("hidden", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        model.setHidden(["age", "id"]);
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayNotHasKey("age");
    });
    it("visible", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        model.setVisible(["name", "id"]);
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayNotHasKey("age");
    });
    it("dynamic hidden", () => {
        var model = new EloquentModelDynamicHiddenStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayNotHasKey("age");
    });
    it("with hidden", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        model.setHidden(["age", "id"]);
        model.makeVisible("age");
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayNotHasKey("id");
    });
    it("make hidden", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "address": "foobar",
            "id": "baz"
        });
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayHasKey("address");
        expect(array).toArrayHasKey("id");
        var array = model.makeHidden("address").toArray();
        expect(array).toArrayNotHasKey("address");
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayHasKey("id");
        var array = model.makeHidden(["name", "age"]).toArray();
        expect(array).toArrayNotHasKey("name");
        expect(array).toArrayNotHasKey("age");
        expect(array).toArrayNotHasKey("address");
        expect(array).toArrayHasKey("id");
    });
    it("dynamic visible", () => {
        var model = new EloquentModelDynamicVisibleStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayNotHasKey("age");
    });
    it("make visible if", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "id": "baz"
        });
        model.setHidden(["age", "id"]);
        model.makeVisibleIf(true, "age");
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayNotHasKey("id");
        model.setHidden(["age", "id"]);
        model.makeVisibleIf(false, "age");
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayNotHasKey("age");
        expect(array).toArrayNotHasKey("id");
        model.setHidden(["age", "id"]);
        model.makeVisibleIf(model => {
            return !isBlank(model.name);
        }, "age");
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayNotHasKey("id");
    });
    it("make hidden if", () => {
        var model = new EloquentModelStub({
            "name": "foo",
            "age": "bar",
            "address": "foobar",
            "id": "baz"
        });
        var array = model.toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayHasKey("address");
        expect(array).toArrayHasKey("id");
        var array = model.makeHiddenIf(true, "address").toArray();
        expect(array).toArrayNotHasKey("address");
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayHasKey("id");
        model.makeVisible("address");
        var array = model.makeHiddenIf(false, ["name", "age"]).toArray();
        expect(array).toArrayHasKey("name");
        expect(array).toArrayHasKey("age");
        expect(array).toArrayHasKey("address");
        expect(array).toArrayHasKey("id");
        var array = model.makeHiddenIf(model => {
            return !isBlank(model.id);
        }, ["name", "age"]).toArray();
        expect(array).toArrayHasKey("address");
        expect(array).toArrayNotHasKey("name");
        expect(array).toArrayNotHasKey("age");
        expect(array).toArrayHasKey("id");
    });
    it("fillable", () => {
        var model = new EloquentModelStub();
        model.fillable(["name", "age"]);
        model.fill({
            "name": "foo",
            "age": "bar"
        });
        expect(model.name).toBe("foo");
        expect(model.age).toBe("bar");
    });
    it("qualify column", () => {
        var model = new EloquentModelStub();
        expect(model.qualifyColumn("column")).toBe("stub.column");
    });
    it("force fill method fills guarded attributes", () => {
        var model = new EloquentModelSaveStub().forceFill({
            "id": 21
        });
        expect(model.id).toEqual(21);
    });
    it("filling json attributes", () => {
        var model = new EloquentModelStub();
        model.fillable(["meta->name", "meta->price", "meta->size->width"]);
        model.fill({
            "meta->name": "foo",
            "meta->price": "bar",
            "meta->size->width": "baz"
        });
        expect(model.toArray()).toEqual({
            "meta": json_encode({
                "name": "foo",
                "price": "bar",
                "size": {
                    "width": "baz"
                }
            })
        });
        var model = new EloquentModelStub({
            "meta": json_encode({
                "name": "Taylor"
            })
        });
        model.fillable(["meta->name", "meta->price", "meta->size->width"]);
        model.fill({
            "meta->name": "foo",
            "meta->price": "bar",
            "meta->size->width": "baz"
        });
        expect(model.toArray()).toEqual({
            "meta": json_encode({
                "name": "foo",
                "price": "bar",
                "size": {
                    "width": "baz"
                }
            })
        });
    });
    it("unguard allows anything to be set", () => {
        var model = new EloquentModelStub();
        EloquentModelStub.unguard();
        model.guard(["*"]);
        model.fill({
            "name": "foo",
            "age": "bar"
        });
        expect(model.name).toBe("foo");
        expect(model.age).toBe("bar");
        EloquentModelStub.unguard(false);
    });
    it("underscore properties are not filled", () => {
        var model = new EloquentModelStub();
        model.fill({
            "_method": "PUT"
        });
        expect(model.getAttributes()).toEqual([]);
    });
    it("guarded", () => {
        var model = new EloquentModelStub();
        model.guard(["name", "age"]);
        model.fill({
            "name": "foo",
            "age": "bar",
            "foo": "bar"
        });
        expect(model.name !== undefined).toFalse();
        expect(model.age !== undefined).toFalse();
        expect(model.foo).toBe("bar");
    });
    it("fillable overrides guarded", () => {
        var model = new EloquentModelStub();
        model.guard(["name", "age"]);
        model.fillable(["age", "foo"]);
        model.fill({
            "name": "foo",
            "age": "bar",
            "foo": "bar"
        });
        expect(model.name !== undefined).toFalse();
        expect(model.age).toBe("bar");
        expect(model.foo).toBe("bar");
    });
    it("global guarded", () => {
        this.expectException(MassAssignmentException);
        this.expectExceptionMessage("name");
        var model = new EloquentModelStub();
        model.guard(["*"]);
        model.fill({
            "name": "foo",
            "age": "bar",
            "votes": "baz"
        });
    });
    it("unguarded runs callback while being unguarded", () => {
        var model = Model.unguarded(() => {
            return new EloquentModelStub().guard(["*"]).fill({
                "name": "Taylor"
            });
        });
        expect(model.name).toBe("Taylor");
        expect(Model.isUnguarded()).toFalse();
    });
    it("unguarded call does not change unguarded state", () => {
        Model.unguard();
        var model = Model.unguarded(() => {
            return new EloquentModelStub().guard(["*"]).fill({
                "name": "Taylor"
            });
        });
        expect(model.name).toBe("Taylor");
        expect(Model.isUnguarded()).toBeTruthy();
        Model.reguard();
    });
    it("unguarded call does not change unguarded state on exception", () => {
        try {
            Model.unguarded(() => {
                throw new Exception();
            });
        }
        catch (e: Exception) {
        }
        expect(Model.isUnguarded()).toFalse();
    });
    it("has one creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.hasOne(EloquentModelSaveStub);
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.eloquent_model_stub_id");
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.hasOne(EloquentModelSaveStub, "foo");
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.foo");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
    });
    it("morph one creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.morphOne(EloquentModelSaveStub, "morph");
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.morph_id");
        expect(relation.getQualifiedMorphType()).toBe("save_stub.morph_type");
        expect(relation.getMorphClass()).toEqual(EloquentModelStub);
    });
    it("correct morph class is returned", () => {
        Relation.morphMap({
            "alias": "AnotherModel"
        });
        var model = new EloquentModelStub();
        try {
            expect(model.getMorphClass()).toEqual(EloquentModelStub);
        }
        finally {
            Relation.morphMap([], false);
        }
    });
    it("has many creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.hasMany(EloquentModelSaveStub);
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.eloquent_model_stub_id");
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.hasMany(EloquentModelSaveStub, "foo");
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.foo");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
    });
    it("morph many creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.morphMany(EloquentModelSaveStub, "morph");
        expect(relation.getQualifiedForeignKeyName()).toBe("save_stub.morph_id");
        expect(relation.getQualifiedMorphType()).toBe("save_stub.morph_type");
        expect(relation.getMorphClass()).toEqual(EloquentModelStub);
    });
    it("belongs to creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.belongsToStub();
        expect(relation.getForeignKeyName()).toBe("belongs_to_stub_id");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.belongsToExplicitKeyStub();
        expect(relation.getForeignKeyName()).toBe("foo");
    });
    it("morph to creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.morphToStub();
        expect(relation.getForeignKeyName()).toBe("morph_to_stub_id");
        expect(relation.getMorphType()).toBe("morph_to_stub_type");
        expect(relation.getRelationName()).toBe("morphToStub");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
        var relation2 = model.morphToStubWithKeys();
        expect(relation2.getForeignKeyName()).toBe("id");
        expect(relation2.getMorphType()).toBe("type");
        expect(relation2.getRelationName()).toBe("morphToStubWithKeys");
        var relation3 = model.morphToStubWithName();
        expect(relation3.getForeignKeyName()).toBe("some_name_id");
        expect(relation3.getMorphType()).toBe("some_name_type");
        expect(relation3.getRelationName()).toBe("someName");
        var relation4 = model.morphToStubWithNameAndKeys();
        expect(relation4.getForeignKeyName()).toBe("id");
        expect(relation4.getMorphType()).toBe("type");
        expect(relation4.getRelationName()).toBe("someName");
    });
    it("belongs to many creates proper relation", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.belongsToMany(EloquentModelSaveStub);
        expect(relation.getQualifiedForeignPivotKeyName()).toBe("eloquent_model_save_stub_eloquent_model_stub.eloquent_model_stub_id");
        expect(relation.getQualifiedRelatedPivotKeyName()).toBe("eloquent_model_save_stub_eloquent_model_stub.eloquent_model_save_stub_id");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
        expect(relation.getRelationName()).toEqual(__FUNCTION__);
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var relation = model.belongsToMany(EloquentModelSaveStub, "table", "foreign", "other");
        expect(relation.getQualifiedForeignPivotKeyName()).toBe("table.foreign");
        expect(relation.getQualifiedRelatedPivotKeyName()).toBe("table.other");
        expect(relation.getParent()).toEqual(model);
        expect(relation.getQuery().getModel()).toInstanceOf(EloquentModelSaveStub);
    });
    it("relations with varied connections", () => {
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasOne(EloquentNoConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasOne(EloquentDifferentConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.morphOne(EloquentNoConnectionModelStub, "type");
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.morphOne(EloquentDifferentConnectionModelStub, "type");
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.belongsTo(EloquentNoConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.belongsTo(EloquentDifferentConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasMany(EloquentNoConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasMany(EloquentDifferentConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasManyThrough(EloquentNoConnectionModelStub, EloquentModelSaveStub);
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.hasManyThrough(EloquentDifferentConnectionModelStub, EloquentModelSaveStub);
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.belongsToMany(EloquentNoConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("non_default");
        var model = new EloquentModelStub();
        model.setConnection("non_default");
        this.addMockConnection(model);
        var relation = model.belongsToMany(EloquentDifferentConnectionModelStub);
        expect(relation.getRelated().getConnectionName()).toBe("different_connection");
    });
    it("models assume their name", () => {
        import ;
        var model = new EloquentModelWithoutTableStub();
        expect(model.getTable()).toBe("eloquent_model_without_table_stubs");
        var namespacedModel = new EloquentModelNamespacedStub();
        expect(namespacedModel.getTable()).toBe("eloquent_model_namespaced_stubs");
    });
    it("the mutator cache is populated", () => {
        var clazz = new EloquentModelStub();
        var expectedAttributes = ["list_items", "password", "appendable"];
        expect(clazz.getMutatedAttributes()).toEqual(expectedAttributes);
    });
    it("route key is primary key", () => {
        var model = new EloquentModelNonIncrementingStub();
        model.id = "foo";
        expect(model.getRouteKey()).toBe("foo");
    });
    it("route name is primary key name", () => {
        var model = new EloquentModelStub();
        expect(model.getRouteKeyName()).toBe("id");
    });
    it("clone model makes a fresh copy of the model", () => {
        var clazz = new EloquentModelStub();
        clazz.id = 1;
        clazz.exists = true;
        clazz.first = "taylor";
        clazz.last = "otwell";
        clazz.created_at = clazz.freshTimestamp();
        clazz.updated_at = clazz.freshTimestamp();
        clazz.setRelation("foo", ["bar"]);
        var clone = clazz.replicate();
        expect(clone.id).toNull();
        expect(clone.exists).toFalse();
        expect(clone.first).toBe("taylor");
        expect(clone.last).toBe("otwell");
        expect(clone.getAttributes()).toArrayNotHasKey("created_at");
        expect(clone.getAttributes()).toArrayNotHasKey("updated_at");
        expect(clone.foo).toEqual(["bar"]);
    });
    it("model observers can be attached to models", () => {
        EloquentModelStub.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@saved");
        events.shouldReceive("forget");
        EloquentModelStub.observe(new EloquentTestObserverStub());
        EloquentModelStub.flushEventListeners();
    });
    it("model observers can be attached to models with string", () => {
        EloquentModelStub.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@saved");
        events.shouldReceive("forget");
        EloquentModelStub.observe(EloquentTestObserverStub);
        EloquentModelStub.flushEventListeners();
    });
    it("model observers can be attached to models through an array", () => {
        EloquentModelStub.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@saved");
        events.shouldReceive("forget");
        EloquentModelStub.observe([EloquentTestObserverStub]);
        EloquentModelStub.flushEventListeners();
    });
    it("throw exception on attaching not exists model observer with string", () => {
        this.expectException(InvalidArgumentException);
        EloquentModelStub.observe(NotExistClass);
    });
    it("throw exception on attaching not exists model observers through an array", () => {
        this.expectException(InvalidArgumentException);
        EloquentModelStub.observe([NotExistClass]);
    });
    it("model observers can be attached to models through calling observe method only once", () => {
        EloquentModelStub.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestObserverStub + "@saved");
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestAnotherObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelStub", EloquentTestAnotherObserverStub + "@saved");
        events.shouldReceive("forget");
        EloquentModelStub.observe([EloquentTestObserverStub, EloquentTestAnotherObserverStub]);
        EloquentModelStub.flushEventListeners();
    });
    it("without event dispatcher", () => {
        EloquentModelSaveStub.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("listen").once()._with("eloquent.creating: Illuminate\\Tests\\Database\\EloquentModelSaveStub", EloquentTestObserverStub + "@creating");
        events.shouldReceive("listen").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelSaveStub", EloquentTestObserverStub + "@saved");
        events.shouldNotReceive("until");
        events.shouldNotReceive("dispatch");
        events.shouldReceive("forget");
        EloquentModelSaveStub.observe(EloquentTestObserverStub);
        var model = EloquentModelSaveStub.withoutEvents(() => {
            var model = new EloquentModelSaveStub();
            model.save();
            return model;
        });
        model.withoutEvents(() => {
            model.first_name = "Taylor";
            model.save();
        });
        events.shouldReceive("until").once()._with("eloquent.saving: Illuminate\\Tests\\Database\\EloquentModelSaveStub", model);
        events.shouldReceive("dispatch").once()._with("eloquent.saved: Illuminate\\Tests\\Database\\EloquentModelSaveStub", model);
        model.last_name = "Otwell";
        model.save();
        EloquentModelSaveStub.flushEventListeners();
    });
    it("set observable events", () => {
        var clazz = new EloquentModelStub();
        clazz.setObservableEvents(["foo"]);
        expect(clazz.getObservableEvents()).toContains("foo");
    });
    it("add observable event", () => {
        var clazz = new EloquentModelStub();
        clazz.addObservableEvents("foo");
        expect(clazz.getObservableEvents()).toContains("foo");
    });
    it("add multiple observeable events", () => {
        var clazz = new EloquentModelStub();
        clazz.addObservableEvents("foo", "bar");
        expect(clazz.getObservableEvents()).toContains("foo");
        expect(clazz.getObservableEvents()).toContains("bar");
    });
    it("remove observable event", () => {
        var clazz = new EloquentModelStub();
        clazz.setObservableEvents(["foo", "bar"]);
        clazz.removeObservableEvents("bar");
        expect(clazz.getObservableEvents()).toNotContains("bar");
    });
    it("remove multiple observable events", () => {
        var clazz = new EloquentModelStub();
        clazz.setObservableEvents(["foo", "bar"]);
        clazz.removeObservableEvents("foo", "bar");
        expect(clazz.getObservableEvents()).toNotContains("foo");
        expect(clazz.getObservableEvents()).toNotContains("bar");
    });
    it("get model attribute method throws exception if not relation", () => {
        this.expectException(LogicException);
        this.expectExceptionMessage("Illuminate\\Tests\\Database\\EloquentModelStub::incorrectRelationStub must return a relationship instance.");
        var model = new EloquentModelStub();
        model.incorrectRelationStub;
    });
    it("model is booted on unserialize", () => {
        var model = new EloquentModelBootingTestStub();
        expect(EloquentModelBootingTestStub.isBooted()).toBeTruthy();
        model.foo = "bar";
        var string = serialize(model);
        var model = null;
        EloquentModelBootingTestStub.unboot();
        expect(EloquentModelBootingTestStub.isBooted()).toFalse();
        unserialize(string);
        expect(EloquentModelBootingTestStub.isBooted()).toBeTruthy();
    });
    it("models trait is initialized", () => {
        var model = new EloquentModelStubWithTrait();
        expect(model.fooBarIsInitialized).toBeTruthy();
    });
    it("appending of attributes", () => {
        var model = new EloquentModelAppendsStub();
        expect(model.is_admin !== undefined).toBeTruthy();
        expect(model.camelCased !== undefined).toBeTruthy();
        expect(model.StudlyCased !== undefined).toBeTruthy();
        expect(model.is_admin).toBe("admin");
        expect(model.camelCased).toBe("camelCased");
        expect(model.StudlyCased).toBe("StudlyCased");
        expect(model.hasAppended("is_admin")).toBeTruthy();
        expect(model.hasAppended("camelCased")).toBeTruthy();
        expect(model.hasAppended("StudlyCased")).toBeTruthy();
        expect(model.hasAppended("not_appended")).toFalse();
        model.setHidden(["is_admin", "camelCased", "StudlyCased"]);
        expect(model.toArray()).toEqual([]);
        model.setVisible([]);
        expect(model.toArray()).toEqual([]);
    });
    it("get mutated attributes", () => {
        var model = new EloquentModelGetMutatorsStub();
        expect(model.getMutatedAttributes()).toEqual(["first_name", "middle_name", "last_name"]);
        EloquentModelGetMutatorsStub.resetMutatorCache();
        EloquentModelGetMutatorsStub.snakeAttributes = false;
        expect(model.getMutatedAttributes()).toEqual(["firstName", "middleName", "lastName"]);
    });
    it("replicate creates a new model instance with same attribute values", () => {
        var model = new EloquentModelStub();
        model.id = "id";
        model.foo = "bar";
        model.created_at = new DateTime();
        model.updated_at = new DateTime();
        var replicated = model.replicate();
        expect(replicated.id).toNull();
        expect(replicated.foo).toBe("bar");
        expect(replicated.created_at).toNull();
        expect(replicated.updated_at).toNull();
    });
    it("replicating event is fired when replicating model", () => {
        var model = new EloquentModelStub();
        model.setEventDispatcher(events = m.mock(Dispatcher));
        events.shouldReceive("dispatch").once()._with("eloquent.replicating: " + get_class(model), m.on(m => {
            return model.is(m);
        }));
        model.replicate();
    });
    it("increment on existing model calls query and sets attribute", () => {
        var model = m.mock(EloquentModelStub + "[newQueryWithoutRelationships]");
        model.exists = true;
        model.id = 1;
        model.syncOriginalAttribute("id");
        model.foo = 2;
        model.shouldReceive("newQueryWithoutRelationships").andReturn(query = m.mock(stdClass));
        query.shouldReceive("where").andReturn(query);
        query.shouldReceive("increment");
        model.publicIncrement("foo", 1);
        expect(model.isDirty()).toFalse();
        model.publicIncrement("foo", 1, {
            "category": 1
        });
        expect(model.foo).toEqual(4);
        expect(model.category).toEqual(1);
        expect(model.isDirty("category")).toBeTruthy();
    });
    it("relationship touch owners is propagated", () => {
        var relation = this.getMockBuilder(BelongsTo).setMethods(["touch"]).disableOriginalConstructor().getMock();
        relation.expects(this.once()).method("touch");
        var model = m.mock(EloquentModelStub + "[partner]");
        this.addMockConnection(model);
        model.shouldReceive("partner").once().andReturn(relation);
        model.setTouchedRelations(["partner"]);
        var mockPartnerModel = m.mock(EloquentModelStub + "[touchOwners]");
        mockPartnerModel.shouldReceive("touchOwners").once();
        model.setRelation("partner", mockPartnerModel);
        model.touchOwners();
    });
    it("relationship touch owners is not propagated if no relationship result", () => {
        var relation = this.getMockBuilder(BelongsTo).setMethods(["touch"]).disableOriginalConstructor().getMock();
        relation.expects(this.once()).method("touch");
        var model = m.mock(EloquentModelStub + "[partner]");
        this.addMockConnection(model);
        model.shouldReceive("partner").once().andReturn(relation);
        model.setTouchedRelations(["partner"]);
        model.setRelation("partner", null);
        model.touchOwners();
    });
    it("model attributes are casted when present in casts array", () => {
        var model = new EloquentModelCastingStub();
        model.setDateFormat("Y-m-d H:i:s");
        model.intAttribute = "3";
        model.floatAttribute = "4.0";
        model.stringAttribute = 2.5;
        model.boolAttribute = 1;
        model.booleanAttribute = 0;
        model.objectAttribute = {
            "foo": "bar"
        };
        var obj = new stdClass();
        obj.foo = "bar";
        model.arrayAttribute = obj;
        model.jsonAttribute = {
            "foo": "bar"
        };
        model.dateAttribute = "1969-07-20";
        model.datetimeAttribute = "1969-07-20 22:56:00";
        model.timestampAttribute = "1969-07-20 22:56:00";
        model.collectionAttribute = new BaseCollection();
        expect(model.intAttribute).toIsInt();
        expect(model.floatAttribute).toIsFloat();
        expect(model.stringAttribute).toIsString();
        expect(model.boolAttribute).toIsBool();
        expect(model.booleanAttribute).toIsBool();
        expect(model.objectAttribute).toIsObject();
        expect(model.arrayAttribute).toIsArray();
        expect(model.jsonAttribute).toIsArray();
        expect(model.boolAttribute).toBeTruthy();
        expect(model.booleanAttribute).toFalse();
        expect(model.objectAttribute).toEqual(obj);
        expect(model.arrayAttribute).toEqual({
            "foo": "bar"
        });
        expect(model.jsonAttribute).toEqual({
            "foo": "bar"
        });
        expect(model.jsonAttributeValue()).toBe("{\"foo\":\"bar\"}");
        expect(model.dateAttribute).toInstanceOf(Carbon);
        expect(model.datetimeAttribute).toInstanceOf(Carbon);
        expect(model.collectionAttribute).toInstanceOf(BaseCollection);
        expect(model.dateAttribute.toDateString()).toBe("1969-07-20");
        expect(model.datetimeAttribute.toDateTimeString()).toBe("1969-07-20 22:56:00");
        expect(model.timestampAttribute).toEqual(-14173440);
        var arr = model.toArray();
        expect(arr["intAttribute"]).toIsInt();
        expect(arr["floatAttribute"]).toIsFloat();
        expect(arr["stringAttribute"]).toIsString();
        expect(arr["boolAttribute"]).toIsBool();
        expect(arr["booleanAttribute"]).toIsBool();
        expect(arr["objectAttribute"]).toIsObject();
        expect(arr["arrayAttribute"]).toIsArray();
        expect(arr["jsonAttribute"]).toIsArray();
        expect(arr["collectionAttribute"]).toIsArray();
        expect(arr["boolAttribute"]).toBeTruthy();
        expect(arr["booleanAttribute"]).toFalse();
        expect(arr["objectAttribute"]).toEqual(obj);
        expect(arr["arrayAttribute"]).toEqual({
            "foo": "bar"
        });
        expect(arr["jsonAttribute"]).toEqual({
            "foo": "bar"
        });
        expect(arr["dateAttribute"]).toBe("1969-07-20 00:00:00");
        expect(arr["datetimeAttribute"]).toBe("1969-07-20 22:56:00");
        expect(arr["timestampAttribute"]).toEqual(-14173440);
    });
    it("model date attribute casting resets time", () => {
        var model = new EloquentModelCastingStub();
        model.setDateFormat("Y-m-d H:i:s");
        model.dateAttribute = "1969-07-20 22:56:00";
        expect(model.dateAttribute.toDateTimeString()).toBe("1969-07-20 00:00:00");
        var arr = model.toArray();
        expect(arr["dateAttribute"]).toBe("1969-07-20 00:00:00");
    });
    it("model attribute casting preserves null", () => {
        var model = new EloquentModelCastingStub();
        model.intAttribute = null;
        model.floatAttribute = null;
        model.stringAttribute = null;
        model.boolAttribute = null;
        model.booleanAttribute = null;
        model.objectAttribute = null;
        model.arrayAttribute = null;
        model.jsonAttribute = null;
        model.dateAttribute = null;
        model.datetimeAttribute = null;
        model.timestampAttribute = null;
        model.collectionAttribute = null;
        var attributes = model.getAttributes();
        expect(attributes["intAttribute"]).toNull();
        expect(attributes["floatAttribute"]).toNull();
        expect(attributes["stringAttribute"]).toNull();
        expect(attributes["boolAttribute"]).toNull();
        expect(attributes["booleanAttribute"]).toNull();
        expect(attributes["objectAttribute"]).toNull();
        expect(attributes["arrayAttribute"]).toNull();
        expect(attributes["jsonAttribute"]).toNull();
        expect(attributes["dateAttribute"]).toNull();
        expect(attributes["datetimeAttribute"]).toNull();
        expect(attributes["timestampAttribute"]).toNull();
        expect(attributes["collectionAttribute"]).toNull();
        expect(model.intAttribute).toNull();
        expect(model.floatAttribute).toNull();
        expect(model.stringAttribute).toNull();
        expect(model.boolAttribute).toNull();
        expect(model.booleanAttribute).toNull();
        expect(model.objectAttribute).toNull();
        expect(model.arrayAttribute).toNull();
        expect(model.jsonAttribute).toNull();
        expect(model.dateAttribute).toNull();
        expect(model.datetimeAttribute).toNull();
        expect(model.timestampAttribute).toNull();
        expect(model.collectionAttribute).toNull();
        var array = model.toArray();
        expect(array["intAttribute"]).toNull();
        expect(array["floatAttribute"]).toNull();
        expect(array["stringAttribute"]).toNull();
        expect(array["boolAttribute"]).toNull();
        expect(array["booleanAttribute"]).toNull();
        expect(array["objectAttribute"]).toNull();
        expect(array["arrayAttribute"]).toNull();
        expect(array["jsonAttribute"]).toNull();
        expect(array["dateAttribute"]).toNull();
        expect(array["datetimeAttribute"]).toNull();
        expect(array["timestampAttribute"]).toNull();
        expect(attributes["collectionAttribute"]).toNull();
    });
    it("model attribute casting fails on unencodable data", () => {
        this.expectException(JsonEncodingException);
        this.expectExceptionMessage("Unable to encode attribute [objectAttribute] for model [Illuminate\\Tests\\Database\\EloquentModelCastingStub] to JSON: Malformed UTF-8 characters, possibly incorrectly encoded.");
        var model = new EloquentModelCastingStub();
        model.objectAttribute = {
            "foo": "b\u00F8r"
        };
        var obj = new stdClass();
        obj.foo = "b\u00F8r";
        model.arrayAttribute = obj;
        model.jsonAttribute = {
            "foo": "b\u00F8r"
        };
        model.getAttributes();
    });
    it("model attribute casting with special float values", () => {
        var model = new EloquentModelCastingStub();
        model.floatAttribute = 0;
        expect(model.floatAttribute).toEqual(0);
        model.floatAttribute = "Infinity";
        expect(model.floatAttribute).toEqual(INF);
        model.floatAttribute = INF;
        expect(model.floatAttribute).toEqual(INF);
        model.floatAttribute = "-Infinity";
        expect(model.floatAttribute).toEqual(-INF);
        model.floatAttribute = -INF;
        expect(model.floatAttribute).toEqual(-INF);
        model.floatAttribute = "NaN";
        expect(model.floatAttribute).toNan();
        model.floatAttribute = NAN;
        expect(model.floatAttribute).toNan();
    });
    it("merge casts merges casts", () => {
        var model = new EloquentModelCastingStub();
        var castCount = count(model.getCasts());
        expect(model.getCasts()).toArrayNotHasKey("foo");
        model.mergeCasts({
            "foo": "date"
        });
        expect(model.getCasts()).toCount(castCount + 1);
        expect(model.getCasts()).toArrayHasKey("foo");
    });
    it("updating non existent model fails", () => {
        var model = new EloquentModelStub();
        expect(model.update()).toFalse();
    });
    it("isset behaves correctly with attributes and relationships", () => {
        var model = new EloquentModelStub();
        expect(model.nonexistent !== undefined).toFalse();
        model.some_attribute = "some_value";
        expect(model.some_attribute !== undefined).toBeTruthy();
        model.setRelation("some_relation", "some_value");
        expect(model.some_relation !== undefined).toBeTruthy();
    });
    it("non existing attribute with internal method name doesnt call method", () => {
        var model = m.mock(EloquentModelStub + "[delete,getRelationValue]");
        model.name = "Spark";
        model.shouldNotReceive("delete");
        model.shouldReceive("getRelationValue").once()._with("belongsToStub").andReturn("relation");
        expect(model.belongsToStub).toBe("relation");
        expect(model.name).toBe("Spark");
        expect(model.delete).toNull();
        var model = m.mock(EloquentModelStub + "[delete]");
        model.delete = 123;
        expect(model.delete).toEqual(123);
    });
    it("int key type preserved", () => {
        var model = this.getMockBuilder(EloquentModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with([], "id").andReturn(1);
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        expect(model.save()).toBeTruthy();
        expect(model.id).toEqual(1);
    });
    it("string key type preserved", () => {
        var model = this.getMockBuilder(EloquentKeyTypeModelStub).setMethods(["newModelQuery", "updateTimestamps", "refresh"]).getMock();
        var query = m.mock(Builder);
        query.shouldReceive("insertGetId").once()._with([], "id").andReturn("string id");
        query.shouldReceive("getConnection").once();
        model.expects(this.once()).method("newModelQuery").willReturn(query);
        expect(model.save()).toBeTruthy();
        expect(model.id).toBe("string id");
    });
    it("scopes method", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        var scopes = {
            0: "published",
            "category": "Laravel",
            "framework": ["Laravel", "5.3"]
        };
        expect(model.scopes(scopes)).toInstanceOf(Builder);
        expect(model.scopesCalled).toEqual(scopes);
    });
    it("scopes method with string", () => {
        var model = new EloquentModelStub();
        this.addMockConnection(model);
        expect(model.scopes("published")).toInstanceOf(Builder);
        expect(model.scopesCalled).toEqual(["published"]);
    });
    it("is with null", () => {
        var firstInstance = new EloquentModelStub({
            "id": 1
        });
        var secondInstance = null;
        expect(firstInstance.is(secondInstance)).toFalse();
    });
    it("is with the same model instance", () => {
        var firstInstance = new EloquentModelStub({
            "id": 1
        });
        var secondInstance = new EloquentModelStub({
            "id": 1
        });
        var result = firstInstance.is(secondInstance);
        expect(result).toBeTruthy();
    });
    it("is with another model instance", () => {
        var firstInstance = new EloquentModelStub({
            "id": 1
        });
        var secondInstance = new EloquentModelStub({
            "id": 2
        });
        var result = firstInstance.is(secondInstance);
        expect(result).toFalse();
    });
    it("is with another table", () => {
        var firstInstance = new EloquentModelStub({
            "id": 1
        });
        var secondInstance = new EloquentModelStub({
            "id": 1
        });
        secondInstance.setTable("foo");
        var result = firstInstance.is(secondInstance);
        expect(result).toFalse();
    });
    it("is with another connection", () => {
        var firstInstance = new EloquentModelStub({
            "id": 1
        });
        var secondInstance = new EloquentModelStub({
            "id": 1
        });
        secondInstance.setConnection("foo");
        var result = firstInstance.is(secondInstance);
        expect(result).toFalse();
    });
    it("without touching callback", () => {
        new EloquentModelStub({
            "id": 1
        });
        var called = false;
        EloquentModelStub.withoutTouching(() => {
            var called = true;
        });
        expect(called).toBeTruthy();
    });
    it("without touching on callback", () => {
        new EloquentModelStub({
            "id": 1
        });
        var called = false;
        Model.withoutTouchingOn([EloquentModelStub], () => {
            var called = true;
        });
        expect(called).toBeTruthy();
    });
    it("add mock connection", () => {
        model.setConnectionResolver(resolver = m.mock(ConnectionResolverInterface));
        resolver.shouldReceive("connection").andReturn(connection = m.mock(Connection));
        connection.shouldReceive("getQueryGrammar").andReturn(grammar = m.mock(Grammar));
        connection.shouldReceive("getPostProcessor").andReturn(processor = m.mock(Processor));
        connection.shouldReceive("query").andReturnUsing(() => {
            return new BaseBuilder(connection, grammar, processor);
        });
    });
    it("touching model with timestamps", () => {
        expect(Model.isIgnoringTouch(Model)).toFalse();
    });
    it("not touching model with updated at null", () => {
        expect(Model.isIgnoringTouch(EloquentModelWithUpdatedAtNull)).toBeTruthy();
    });
    it("not touching model without timestamps", () => {
        expect(Model.isIgnoringTouch(EloquentModelWithoutTimestamps)).toBeTruthy();
    });
    it("get original casts attributes", () => {
        var model = new EloquentModelCastingStub();
        model.intAttribute = "1";
        model.floatAttribute = "0.1234";
        model.stringAttribute = 432;
        model.boolAttribute = "1";
        model.booleanAttribute = "0";
        var stdClass = new stdClass();
        stdClass.json_key = "json_value";
        model.objectAttribute = stdClass;
        var array = {
            "foo": "bar"
        };
        var collection = collect(array);
        model.arrayAttribute = array;
        model.jsonAttribute = array;
        model.collectionAttribute = collection;
        model.syncOriginal();
        model.intAttribute = 2;
        model.floatAttribute = 0.443;
        model.stringAttribute = "12";
        model.boolAttribute = true;
        model.booleanAttribute = false;
        model.objectAttribute = stdClass;
        model.arrayAttribute = {
            "foo": "bar2"
        };
        model.jsonAttribute = {
            "foo": "bar2"
        };
        model.collectionAttribute = collect({
            "foo": "bar2"
        });
        expect(model.getOriginal("intAttribute")).toIsInt();
        expect(model.getOriginal("intAttribute")).toEqual(1);
        expect(model.intAttribute).toEqual(2);
        expect(model.getAttribute("intAttribute")).toEqual(2);
        expect(model.getOriginal("floatAttribute")).toIsFloat();
        expect(model.getOriginal("floatAttribute")).toEqual(0.1234);
        expect(model.floatAttribute).toEqual(0.443);
        expect(model.getOriginal("stringAttribute")).toIsString();
        expect(model.getOriginal("stringAttribute")).toBe("432");
        expect(model.stringAttribute).toBe("12");
        expect(model.getOriginal("boolAttribute")).toIsBool();
        expect(model.getOriginal("boolAttribute")).toBeTruthy();
        expect(model.boolAttribute).toBeTruthy();
        expect(model.getOriginal("booleanAttribute")).toIsBool();
        expect(model.getOriginal("booleanAttribute")).toFalse();
        expect(model.booleanAttribute).toFalse();
        expect(model.getOriginal("objectAttribute")).toEqual(stdClass);
        expect(model.getOriginal("objectAttribute")).toEqual(model.getAttribute("objectAttribute"));
        expect(model.getOriginal("arrayAttribute")).toEqual(array);
        expect(model.getOriginal("arrayAttribute")).toEqual({
            "foo": "bar"
        });
        expect(model.getAttribute("arrayAttribute")).toEqual({
            "foo": "bar2"
        });
        expect(model.getOriginal("jsonAttribute")).toEqual(array);
        expect(model.getOriginal("jsonAttribute")).toEqual({
            "foo": "bar"
        });
        expect(model.getAttribute("jsonAttribute")).toEqual({
            "foo": "bar2"
        });
        expect(model.getOriginal("collectionAttribute").toArray()).toEqual({
            "foo": "bar"
        });
        expect(model.getAttribute("collectionAttribute").toArray()).toEqual({
            "foo": "bar2"
        });
    });
    it("unsaved model", () => {
        var user = new UnsavedModel();
        user.name = null;
        expect(user.name).toNull();
    });
});
export class EloquentTestObserverStub {
    public creating() {
    }
    public saved() {
    }
}
export class EloquentTestAnotherObserverStub {
    public creating() {
    }
    public saved() {
    }
}
export class EloquentModelStub extends Model {
    public connection: any;
    public scopesCalled: any = [];
    protected table: any = "stub";
    protected guarded: any = [];
    protected morph_to_stub_type: any = EloquentModelSaveStub;
    protected casts: any = {
        "castedFloat": "float"
    };
    public getListItemsAttribute(value) {
        return json_decode(value, true);
    }
    public setListItemsAttribute(value) {
        this.attributes["list_items"] = json_encode(value);
    }
    public getPasswordAttribute() {
        return "******";
    }
    public setPasswordAttribute(value) {
        this.attributes["password_hash"] = sha1(value);
    }
    public publicIncrement(column, amount = 1, extra = []) {
        return this.increment(column, amount, extra);
    }
    public belongsToStub() {
        return this.belongsTo(EloquentModelSaveStub);
    }
    public morphToStub() {
        return this.morphTo();
    }
    public morphToStubWithKeys() {
        return this.morphTo(null, "type", "id");
    }
    public morphToStubWithName() {
        return this.morphTo("someName");
    }
    public morphToStubWithNameAndKeys() {
        return this.morphTo("someName", "type", "id");
    }
    public belongsToExplicitKeyStub() {
        return this.belongsTo(EloquentModelSaveStub, "foo");
    }
    public incorrectRelationStub() {
        return "foo";
    }
    public getDates() {
        return [];
    }
    public getAppendableAttribute() {
        return "appended";
    }
    public scopePublished(builder) {
        this.scopesCalled.push("published");
    }
    public scopeCategory(builder, category) {
        this.scopesCalled["category"] = category;
    }
    public scopeFramework(builder, framework, version) {
        this.scopesCalled["framework"] = [framework, version];
    }
}
/*trait*/ export class FooBarTrait {
    public fooBarIsInitialized: any = false;
    public initializeFooBarTrait() {
        this.fooBarIsInitialized = true;
    }
}
export class EloquentModelStubWithTrait extends EloquentModelStub {
}
export class EloquentModelCamelStub extends EloquentModelStub {
    public static snakeAttributes: any = false;
}
export class EloquentDateModelStub extends EloquentModelStub {
    public getDates() {
        return ["created_at", "updated_at"];
    }
}
export class EloquentModelSaveStub extends Model {
    protected table: any = "save_stub";
    protected guarded: any = ["id"];
    public save(options = []) {
        if (this.fireModelEvent("saving") === false) {
            return false;
        }
        _SERVER["__eloquent.saved"] = true;
        this.fireModelEvent("saved", false);
    }
    public setIncrementing(value) {
        this.incrementing = value;
    }
    public getConnection() {
        var mock = m.mock(Connection);
        mock.shouldReceive("getQueryGrammar").andReturn(grammar = m.mock(Grammar));
        mock.shouldReceive("getPostProcessor").andReturn(processor = m.mock(Processor));
        mock.shouldReceive("getName").andReturn("name");
        mock.shouldReceive("query").andReturnUsing(() => {
            return new BaseBuilder(mock, grammar, processor);
        });
        return mock;
    }
}
export class EloquentKeyTypeModelStub extends EloquentModelStub {
    protected keyType: any = "string";
}
export class EloquentModelFindWithWritePdoStub extends Model {
    public newQuery() {
        var mock = m.mock(Builder);
        mock.shouldReceive("useWritePdo").once().andReturnSelf();
        mock.shouldReceive("find").once()._with(1).andReturn("foo");
        return mock;
    }
}
export class EloquentModelDestroyStub extends Model {
    public newQuery() {
        var mock = m.mock(Builder);
        mock.shouldReceive("whereIn").once()._with("id", [1, 2, 3]).andReturn(mock);
        mock.shouldReceive("get").once().andReturn([model = m.mock(stdClass)]);
        model.shouldReceive("delete").once();
        return mock;
    }
}
export class EloquentModelHydrateRawStub extends Model {
    public static hydrate(items, connection = null) {
        return "hydrated";
    }
    public getConnection() {
        var mock = m.mock(Connection);
        mock.shouldReceive("select").once()._with("SELECT ?", ["foo"]).andReturn([]);
        return mock;
    }
}
export class EloquentModelWithStub extends Model {
    public newQuery() {
        var mock = m.mock(Builder);
        mock.shouldReceive("with").once()._with(["foo", "bar"]).andReturn("foo");
        return mock;
    }
}
export class EloquentModelWithoutRelationStub extends Model {
    public _with: any = ["foo"];
    protected guarded: any = [];
    public getEagerLoads() {
        return this.eagerLoads;
    }
}
export class EloquentModelWithoutTableStub extends Model {
}
export class EloquentModelBootingTestStub extends Model {
    public static unboot() {
        delete EloquentModelBootingTestStub.booted[EloquentModelBootingTestStub];
    }
    public static isBooted() {
        return array_key_exists(EloquentModelBootingTestStub, EloquentModelBootingTestStub.booted);
    }
}
export class EloquentModelAppendsStub extends Model {
    protected appends: any = ["is_admin", "camelCased", "StudlyCased"];
    public getIsAdminAttribute() {
        return "admin";
    }
    public getCamelCasedAttribute() {
        return "camelCased";
    }
    public getStudlyCasedAttribute() {
        return "StudlyCased";
    }
}
export class EloquentModelGetMutatorsStub extends Model {
    public static resetMutatorCache() {
        EloquentModelGetMutatorsStub.mutatorCache = [];
    }
    public getFirstNameAttribute() {
    }
    public getMiddleNameAttribute() {
    }
    public getLastNameAttribute() {
    }
    public doNotgetFirstInvalidAttribute() {
    }
    public doNotGetSecondInvalidAttribute() {
    }
    public doNotgetThirdInvalidAttributeEither() {
    }
    public doNotGetFourthInvalidAttributeEither() {
    }
}
export class EloquentModelCastingStub extends Model {
    protected casts: any = {
        "intAttribute": "int",
        "floatAttribute": "float",
        "stringAttribute": "string",
        "boolAttribute": "bool",
        "booleanAttribute": "boolean",
        "objectAttribute": "object",
        "arrayAttribute": "array",
        "jsonAttribute": "json",
        "collectionAttribute": "collection",
        "dateAttribute": "date",
        "datetimeAttribute": "datetime",
        "timestampAttribute": "timestamp"
    };
    public jsonAttributeValue() {
        return this.attributes["jsonAttribute"];
    }
    protected serializeDate(date) {
        return date.format("Y-m-d H:i:s");
    }
}
export class EloquentModelDynamicHiddenStub extends Model {
    protected table: any = "stub";
    protected guarded: any = [];
    public getHidden() {
        return ["age", "id"];
    }
}
export class EloquentModelDynamicVisibleStub extends Model {
    protected table: any = "stub";
    protected guarded: any = [];
    public getVisible() {
        return ["name", "id"];
    }
}
export class EloquentModelNonIncrementingStub extends Model {
    protected table: any = "stub";
    protected guarded: any = [];
    public incrementing: any = false;
}
export class EloquentNoConnectionModelStub extends EloquentModelStub {
}
export class EloquentDifferentConnectionModelStub extends EloquentModelStub {
    public connection: any = "different_connection";
}
export class EloquentModelSavingEventStub {
}
export class EloquentModelEventObjectStub extends Model {
    protected dispatchesEvents: any = {
        "saving": EloquentModelSavingEventStub
    };
}
export class EloquentModelWithoutTimestamps extends Model {
    protected table: any = "stub";
    public timestamps: any = false;
}
export class EloquentModelWithUpdatedAtNull extends Model {
    protected table: any = "stub";
    static UPDATED_AT = null;
}
export class UnsavedModel extends Model {
    protected casts: any = {
        "name": Uppercase
    };
}
export class Uppercase implements CastsInboundAttributes {
    public set(model, key, value, attributes) {
        return is_string(value) ? value.toUpperCase() : value;
    }
}
