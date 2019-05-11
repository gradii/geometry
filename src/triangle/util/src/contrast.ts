// 数组元素为数字
export function compareNum(num1, num2) {
  return num1 - num2;
}

// 数组元素为对象， 需要传入对象的属性
export function compareObj(prop) {
  return (val1, val2) => {
    return val1[prop] - val2[prop];
  };
}

// 需要参照某数组进行固定排序
export function contrast(referArr, prop) {
  return (obj1, obj2) => {
    return referArr.indexOf(obj1[prop]) - referArr.indexOf(obj2[prop]);
  };
}
