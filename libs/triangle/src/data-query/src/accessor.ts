import { isNullOrEmptyString } from './utils';

const empty = ['', ''];
const concat = function (left, right) {
  return [left[0] + right[0], left[1] + right[1]];
};
const notEmpty = function (member) {
  return !isNullOrEmptyString(member);
};
const parseMember = function (member, idx, length) {
  let first = '(';
  const index = member.indexOf('[');
  if (index === -1) {
    member = '.' + member;
  } else if (index > 0) {
    first += '(';
    member = '.' + member.substring(0, index) + ' || {})' + member.substring(index);
  }
  member += idx < length - 1 ? ' || {})' : ')';
  return [first, member];
};
const wrapExpression = function (members, paramName) {
  return members
    .filter(notEmpty)
    .reduce(function (pair, member, idx, arr) {
      return concat(pair, parseMember(member, idx, arr.length));
    }, empty)
    .join(paramName);
};
const getterCache = {};
export let expr = function (expression = '', safe = false, paramName = 'd') {
  if (expression && expression.charAt(0) !== '[') {
    expression = '.' + expression;
  }
  if (safe) {
    expression = expression.replace(/"([^.]*)\.([^"]*)"/g, '"$1_$DOT$_$2"');
    expression = expression.replace(/'([^.]*)\.([^']*)'/g, '\'$1_$DOT$_$2\'');
    expression = wrapExpression(expression.split('.'), paramName);
    expression = expression.replace(/_\$DOT\$_/g, '.');
  } else {
    expression = paramName + expression;
  }
  return expression;
};
export let getter = function (expression: string, safe?: boolean) {
  const key = expression + safe;
  return (getterCache[key] = getterCache[key] || new Function('d', 'return ' + expr(expression, safe)));
};
