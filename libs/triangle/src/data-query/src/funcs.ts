export const either = function (predicate, right, left) {
  return function (value) {
    return predicate(value) ? right(value) : left(value);
  };
};
export const compose = function (...args) {
  return function (data) {
    return args.reduceRight(function (acc, curr) {
      return curr(acc);
    }, data);
  };
};
