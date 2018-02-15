import { compose } from '../funcs';
import { isPresent } from '../utils';

export interface ServerGroupResult {
  Items: Object[];
  Aggregates: any;
  Member: string;
  Key: any;
  HasSubgroups: boolean;
}

const set = function (field, target, value) {
  target[field] = value;
  return target;
};
const convert = function (mapper) {
  return function (values) {
    return Object.keys(values).reduce(mapper.bind(null, values), {});
  };
};
const translateAggregate = convert(function (source, acc, field) {
  return set(field.toLowerCase(), acc, source[field]);
});
const translateAggregates = convert(function (source, acc, field) {
  return set(field, acc, translateAggregate(source[field]));
});
const valueOrDefault = function (value, defaultValue) {
  return isPresent(value) ? value : defaultValue;
};
const normalizeGroup = function (group) {
  return {
    aggregates  : group.Aggregates || group.aggregates,
    field       : group.Member || group.member || group.field,
    hasSubgroups: group.HasSubgroups || group.hasSubgroups || false,
    items       : group.Items || group.items,
    value       : valueOrDefault(group.Key, valueOrDefault(group.key, group.value))
  };
};
const translateGroup = compose(function ({field, hasSubgroups, value, aggregates, items}) {
  return {
    aggregates: translateAggregates(aggregates),
    field     : field,
    items     : hasSubgroups ? items.map(translateGroup) : items,
    value     : value
  };
}, normalizeGroup);
export let translateDataSourceResultGroups = function (data) {
  return data.map(translateGroup);
};
export let translateAggregateResults = function (data) {
  return (data || []).reduce(function (acc, x) {
    return set(x.Member, acc, set(x.AggregateMethodName.toLowerCase(), acc[x.Member] || {}, x.Value));
  }, {});
};
