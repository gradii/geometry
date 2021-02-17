import { isPresent, isNumeric, isDate } from './utils';
import { getter } from './accessor';

export interface AggregateResult {
  [fieldName: string]: {
    count?: number;
    sum?: number;
    average?: number;
    min?: number;
    max?: number;
  };
}

const valueToString = function (value) {
  value = isPresent(value) && value.getTime ? value.getTime() : value;
  return value + '';
};

export function groupCombinator(field) {
  const prop = getter(field, true);
  let position = 0;
  return function (agg, value) {
    agg[field] = agg[field] || {};
    const groupValue = prop(value);
    const key = valueToString(groupValue);
    const values = agg[field][key] || {__position: position++, aggregates: {}, items: [], value: groupValue};
    values.items.push(value);
    agg[field][key] = values;
    return agg;
  };
}

export function expandAggregates(result) {
  if (result === void 0) {
    result = {};
  }
  Object.keys(result).forEach(function (field) {
    const aggregates = result[field];
    Object.keys(aggregates).forEach(function (aggregate) {
      aggregates[aggregate] = aggregates[aggregate].result();
    });
  });
  return result;
}

function aggregatesFuncs(name) {
  return {
    average: function () {
      let value = 0;
      let count = 0;
      return {
        calc  : function (curr) {
          if (isNumeric(curr)) {
            value += curr;
            count++;
          } else {
            value = curr;
          }
        },
        result: function () {
          return isNumeric(value) ? value / count : value;
        }
      };
    },
    count  : function () {
      let state = 0;
      return {
        calc  : function () {
          return state++;
        },
        result: function () {
          return state;
        }
      };
    },
    max    : function () {
      let state = Number.NEGATIVE_INFINITY;
      return {
        calc  : function (value) {
          state = isNumeric(state) || isDate(state) ? state : value;
          if (state < value && (isNumeric(value) || isDate(value))) {
            state = value;
          }
        },
        result: function () {
          return state;
        }
      };
    },
    min    : function () {
      let state = Number.POSITIVE_INFINITY;
      return {
        calc  : function (value) {
          state = isNumeric(state) || isDate(state) ? state : value;
          if (state > value && (isNumeric(value) || isDate(value))) {
            state = value;
          }
        },
        result: function () {
          return state;
        }
      };
    },
    sum    : function () {
      let state = 0;
      return {
        calc  : function (value) {
          return (state += value);
        },
        result: function () {
          return state;
        }
      };
    }
  }[name]();
}

export function aggregatesCombinator(descriptors) {
  const functions = descriptors.map(function (descriptor) {
    const fieldAccessor = getter(descriptor.field, true);
    const aggregateName = (descriptor.aggregate || '').toLowerCase();
    const aggregateAccessor = getter(aggregateName, true);
    return function (state, value) {
      const fieldAggregates = fieldAccessor(state) || {};
      const aggregateFunction = aggregateAccessor(fieldAggregates) || aggregatesFuncs(aggregateName);
      aggregateFunction.calc(fieldAccessor(value));
      fieldAggregates[descriptor.aggregate] = aggregateFunction;
      state[descriptor.field] = fieldAggregates;
      return state;
    };
  });
  return function (state, value) {
    return functions.reduce(function (agg, calc) {
      return calc(agg, value);
    }, state);
  };
}

export function concat(arr, value) {
  arr.push(value);
  return arr;
}

export function map(transform) {
  return function (reduce) {
    return function (acc, curr, index) {
      return reduce(acc, transform(curr, index));
    };
  };
}

export function filter(predicate) {
  return function (reduce) {
    return function (acc, curr) {
      return predicate(curr) ? reduce(acc, curr) : acc;
    };
  };
}

export function isTransformerResult(source) {
  return isPresent(source.__value);
}

function reduced(x) {
  if (isTransformerResult(x)) {
    return x;
  }
  return {
    __value: x,
    reduced: true
  };
}

export function take(count) {
  return function (reduce) {
    return function (acc, curr) {
      return count-- > 0 ? reduce(acc, curr) : reduced(acc);
    };
  };
}

export function takeWhile(predicate) {
  return function (reduce) {
    return function (acc, curr) {
      return predicate(curr) ? reduce(acc, curr) : reduced(acc);
    };
  };
}

export function skip(count) {
  return function (reduce) {
    return function (acc, curr) {
      return count-- <= 0 ? reduce(acc, curr) : acc;
    };
  };
}

export function exec(transform, initialValue, data) {
  let result = initialValue;
  for (let idx = 0, length_1 = data.length; idx < length_1; idx++) {
    result = transform(result, data[idx], idx);
    if (isTransformerResult(result)) {
      result = result.__value;
      break;
    }
  }
  return result;
}
