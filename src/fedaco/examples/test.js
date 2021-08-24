var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SomeArg = /** @class */ (function () {
  function SomeArg() {
  }
  return SomeArg;
}());
let t1
function SomeDecorator() {
  return function (target, name) {
    t1 = target;
    debugger;
  };
}
var Child = /** @class */ (function () {
  function Child() {
  }
  __decorate([
    SomeDecorator(),
    __metadata("design:type", Object)
  ], Child.prototype, "name", void 0);
  return Child;
}());

console.log(t1 === Child.prototype)
debugger;