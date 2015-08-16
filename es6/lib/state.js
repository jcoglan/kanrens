import { inspect } from 'util';
import Pair from './pair';
import Variable from './variable';

export default class State {
  constructor(variables = [], values = new Map()) {
    this._variables = variables;
    this._values    = values;
  }

  createVars(...names) {
    let vars = Variable.named(...names);
    return [new State(this._variables.concat(vars), this._values), vars];
  }

  assign(...values) {
    var newMap = new Map(Array.from(this._values));
    for (let [key, value] of values) newMap.set(key, value);
    return new State(this._variables, newMap);
  }

  walk(variable) {
    if (this._values.has(variable))
      return this.walk(this._values.get(variable));
    else if (variable instanceof Pair)
      return new Pair(this.walk(variable.left), this.walk(variable.right));
    else
      return variable;
  }

  unify(a, b) {
    [a, b] = [this.walk(a), this.walk(b)];

    if (a === b) {
      return this;
    } else if (a instanceof Variable) {
      return this.assign([a, b]);
    } else if (b instanceof Variable) {
      return this.assign([b, a]);
    } else if (a instanceof Pair && b instanceof Pair) {
      let state = this.unify(a.left, b.left);
      return state && state.unify(a.right, b.right);
    } else {
      return null;
    }
  }

  results(n = this._variables.length) {
    return this._variables.slice(0, n).map(v => this.walk(v));
  }

  result(n = 0) {
    return this.results()[n];
  }

  inspect() {
    let pairs = Array.from(this._values).map(pair => pair.map(inspect).join(' = ')),
        vars  = inspect(this._variables);

    return `<State ${ vars } [${ pairs.join(', ') }]>`;
  }
}
