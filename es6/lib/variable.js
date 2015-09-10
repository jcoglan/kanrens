export default class Variable {
  constructor(name) {
    this._name = name;
  }

  inspect() {
    return this._name;
  }

  static named(...names) {
    return names.map(name => new Variable(name))
  }
}
