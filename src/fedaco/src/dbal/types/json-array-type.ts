/**
 * @license
 *
 * Use of this source code is governed by an MIT-style license
 */

import { Types } from './Types';
import { JsonType } from './JsonType';

/*Array Type which can be used to generate json arrays.*/
export class JsonArrayType extends JsonType {
  /*{@inheritdoc}*/
  public convertToPHPValue(value, platform) {
    if (value === null || value === '') {
      return [];
    }
    // var value = is_resource(value) ? stream_get_contents(value) : value;
    return JSON.parse(value) as any[];
  }

  /*{@inheritdoc}*/
  public getName() {
    return Types.JSON_ARRAY;
  }

  /*{@inheritdoc}*/
  public requiresSQLCommentHint(platform) {
    return true;
  }
}
