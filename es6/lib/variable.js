export default class Variable {
  constructor(name) {
    this._name = name;
  }

  inspect() {
    return this._name;
  }
}

Variable.named = (...names) =>
  names.map(name => new Variable(name))
