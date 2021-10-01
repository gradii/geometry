import { Database } from 'sqlite3';

describe('test sqlite', () => {
  it('test sqlite', (done) => {
    const db = new Database('tmp/integration.sqlite');

    const stmt = db.prepare(`create table "test_orders"
                             (
                               "id"         integer not null primary key autoincrement,
                               "item_type"  varchar not null,
                               "item_id"    integer not null,
                               "created_at" datetime,
                               "updated_at" datetime
                             )`);
    // stmt.run((err) => {
    //     if (err) {
    //       console.log(err);
    //     }
    //   }
    // ).finalize((err) => {
    //   expect(err).toBe('sdf');
    //   if (err) {
    //     throw err;
    //   }
    //   done();
    // });
  });
});
