import { isCompositeFilterDescriptor } from '../filtering/filter-descriptor.interface';
import { isPresent, isNotNullOrEmptyString, isArray } from '../utils';
import { getter } from '../accessor';
import { compose, either } from '../funcs';
import { isStringValue, isDateValue, quote, serializeFilters, toUTC } from '../filter-serialization.common';
import { State } from '../state';
import { AggregateDescriptor } from '../grouping/aggregate.operators';
const prefixWith = function(key) {
  return function(value) {
    return key + '=' + value;
  };
};
const empty = function() {
  return '';
};
const isNotEmptyArray = function(value) {
  return isPresent(value) && isArray(value) && value.length > 0;
};
const has = function(accessor) {
  return function(value) {
    return isPresent(accessor(value));
  };
};
const isNotEmpty = function(accessor) {
  return function(value) {
    return isNotEmptyArray(accessor(value));
  };
};
const runOrEmpty = function(predicate, fn) {
  return either(predicate, fn, empty);
};
const calcPage = function(_a) {
  const skip = _a.skip,
    take = _a.take;
  return Math.floor((skip || 0) / take) + 1;
};
const formatDescriptors = function(accessor, formatter) {
  return function(state) {
    return accessor(state)
      .map(formatter)
      .join('~');
  };
};
const removeAfter = function(what) {
  return function(str) {
    return str.slice(0, str.indexOf(what));
  };
};
const replace = function(patterns) {
  return compose.apply(
    void 0,
    patterns.map(function(_a) {
      const left = _a[0],
        right = _a[1];
      return function(s) {
        return s.replace(new RegExp(left, 'g'), right);
      };
    })
  );
};
const sanitizeDateLiterals = replace([['"', ''], [':', '-']]);
const removeAfterDot = removeAfter('.');
const directionFormatter = function(_a) {
  const field = _a.field,
    _b = _a.dir,
    dir = _b === void 0 ? 'asc' : _b;
  return field + '-' + dir;
};
const aggregateFormatter = function(_a) {
  const field = _a.field,
    aggregate = _a.aggregate;
  return field + '-' + aggregate;
};
const take = getter('take');
const aggregates = getter('aggregates');
const skip = getter('skip');
const group = getter('group');
const sort = getter('sort', true);
const formatSort = formatDescriptors(sort, directionFormatter);
const formatGroup = formatDescriptors(group, directionFormatter);
const formatAggregates = formatDescriptors(aggregates, aggregateFormatter);
const prefixDateValue = function(value) {
  return "datetime'" + value + "'";
};
const formatDateValue = compose(prefixDateValue, removeAfterDot, sanitizeDateLiterals, JSON.stringify, toUTC);
const formatDate = function(_a) {
  const field = _a.field,
    value = _a.value,
    ignoreCase = _a.ignoreCase,
    operator = _a.operator;
  return {
    value: formatDateValue(value),
    field: field,
    ignoreCase: ignoreCase,
    operator: operator
  };
};
const normalizeSort = function(state) {
  return Object.assign({}, state, {
    sort: (sort(state) || []).filter(function(_a) {
      const dir = _a.dir;
      return isNotNullOrEmptyString(dir);
    })
  });
};
const transformSkip = compose(prefixWith('page'), calcPage);
const transformTake = compose(prefixWith('pageSize'), take);
const transformGroup = compose(prefixWith('group'), formatGroup);
const transformSort = compose(prefixWith('sort'), formatSort);
const transformAggregates = compose(prefixWith('aggregate'), formatAggregates);
const serializePage = runOrEmpty(has(skip), transformSkip);
const serializePageSize = runOrEmpty(has(take), transformTake);
const serializeGroup = runOrEmpty(isNotEmpty(group), transformGroup);
const serializeAggregates = runOrEmpty(has(aggregates), transformAggregates);
const serializeSort = compose(runOrEmpty(isNotEmpty(sort), transformSort), normalizeSort);
const hasField = function(_a) {
  const field = _a.field;
  return isNotNullOrEmptyString(field);
};
const filterFormatter = function(_a) {
  const field = _a.field,
    operator = _a.operator,
    value = _a.value;
  return field + '~' + operator + '~' + value;
};
const dateFormatter = either(isDateValue, compose(filterFormatter, formatDate), filterFormatter);
const typedFormatter = runOrEmpty(hasField, either(isStringValue, compose(filterFormatter, quote), dateFormatter));
const join = function(_a) {
  const logic = _a.logic;
  return '~' + logic + '~';
};
const serialize = serializeFilters(function(filter) {
  return either(isCompositeFilterDescriptor, serialize, typedFormatter)(filter);
}, join);
const serializeFilter = function(_a) {
  const filter = _a.filter;
  if (filter && filter.filters) {
    const filters = serialize(filter);
    if (filters.length) {
      return 'filter=' + filters;
    }
  }
  return '';
};
const rules = function(state) {
  return function(key) {
    return {
      aggregates: serializeAggregates(state),
      filter: serializeFilter(state),
      group: serializeGroup(state),
      skip: serializePage(state),
      sort: serializeSort(state),
      take: serializePageSize(state)
    }[key];
  };
};
export let toDataSourceRequestString = function(state) {
  return Object.keys(state)
    .map(rules(state))
    .filter(isNotNullOrEmptyString)
    .join('&');
};

export type DataSourceRequestState = State & {
  aggregates?: Array<AggregateDescriptor>;
};
