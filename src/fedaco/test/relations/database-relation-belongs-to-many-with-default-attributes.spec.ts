import { Builder } from "Illuminate/Database/Eloquent/Builder";
import { Model } from "Illuminate/Database/Eloquent/Model";
import { BelongsToMany } from "Illuminate/Database/Eloquent/Relations/BelongsToMany";
import { Mockery as m } from "Mockery";
import { stdClass } from "stdClass";
describe("test database eloquent belongs to many with default attributes", () => {
    it("tear down", () => {
        m.close();
    });
    it("with pivot value method sets where conditions for fetching", () => {
        var relation = this.getMockBuilder(BelongsToMany).setMethods(["touchIfTouching"]).setConstructorArgs(this.getRelationArguments()).getMock();
        relation.withPivotValue({
            "is_admin": 1
        });
    });
    it("with pivot value method sets default arguments for insertion", () => {
        var relation = this.getMockBuilder(BelongsToMany).setMethods(["touchIfTouching"]).setConstructorArgs(this.getRelationArguments()).getMock();
        relation.withPivotValue({
            "is_admin": 1
        });
        var query = m.mock(stdClass);
        query.shouldReceive("from").once()._with("club_user").andReturn(query);
        query.shouldReceive("insert").once()._with([{
                "club_id": 1,
                "user_id": 1,
                "is_admin": 1
            }]).andReturn(true);
        relation.getQuery().shouldReceive("getQuery").andReturn(mockQueryBuilder = m.mock(stdClass));
        mockQueryBuilder.shouldReceive("newQuery").once().andReturn(query);
        relation.attach(1);
    });
    it("get relation arguments", () => {
        var parent = m.mock(Model);
        parent.shouldReceive("getKey").andReturn(1);
        parent.shouldReceive("getCreatedAtColumn").andReturn("created_at");
        parent.shouldReceive("getUpdatedAtColumn").andReturn("updated_at");
        parent.shouldReceive("getAttribute")._with("id").andReturn(1);
        var builder = m.mock(Builder);
        var related = m.mock(Model);
        builder.shouldReceive("getModel").andReturn(related);
        related.shouldReceive("getTable").andReturn("users");
        related.shouldReceive("getKeyName").andReturn("id");
        builder.shouldReceive("join").once()._with("club_user", "users.id", "=", "club_user.user_id");
        builder.shouldReceive("where").once()._with("club_user.club_id", "=", 1);
        builder.shouldReceive("where").once()._with("club_user.is_admin", "=", 1, "and");
        return [builder, parent, "club_user", "club_id", "user_id", "id", "id", null, false];
    });
});
