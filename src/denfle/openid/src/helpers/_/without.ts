import remove from './remove';

export default (array, predicate) => {
  const clone = [...array];
  remove(clone, predicate);
  return clone;
};
