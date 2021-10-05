import { Collection } from "Illuminate/Database/Eloquent/Collection";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { Pivot } from "Illuminate/Database/Eloquent/Relations/Pivot";
import { Mockery } from "Mockery";
import { TestCase } from "PHPUnit/Framework/TestCase";
describe("test database eloquent collection queueable", () => {
    it("tear down", () => {
        Mockery.close();
    });
    it("serializes pivots entities id", () => {
        var spy = Mockery.spy(Pivot);
        var c = new Collection([spy]);
        c.getQueueableIds();
        spy.shouldHaveReceived().getQueueableId().once();
    });
    it("serializes model entities by id", () => {
        var spy = Mockery.spy(Model);
        var c = new Collection([spy]);
        c.getQueueableIds();
        spy.shouldHaveReceived().getQueueableId().once();
    });
    it("json serialization of collection queueable ids works", () => {
        var mock = Mockery.mock(Model, {
            "getKey": random_bytes(10),
            "getQueueableId": "mocked"
        });
        var c = new Collection([mock]);
        var payload = {
            "ids": c.getQueueableIds()
        };
        expect("EloquentCollection is not using the QueueableEntity::getQueueableId() method.").toNotFalse(json_encode(payload));
    });
});
