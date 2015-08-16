import * as stream from './stream';

export default class Goal {
  constructor(func) {
    this._func = func;
  }

  pursue(state) {
    return this._func(state);
  }

  static equal(a, b) {
    return new Goal(state => {
      state = state.unify(a, b);

      return function*() {
        if (state) yield state;
      }();
    });
  }
  
  static bind(names, func) {
    return new Goal(state => {
      let [newState, vars] = state.createVars(...names),
          goal = func(...vars);

      return goal.pursue(newState);
    });
  }

  static either(a, b) {
    return new Goal(state => {
      return stream.interleave(a.pursue(state), b.pursue(state));
    });
  }

  static any(first, ...rest) {
    if (rest.length === 0)
      return first;
    else
      return Goal.either(first, Goal.any(...rest));
  }

  static both(a, b) {
    return new Goal(state => {
      return function*() {
        for (let state of a.pursue(state)) {
          for (let result of b.pursue(state))
            yield result;
        }
      }();
    });
  }

  static all(first, ...rest) {
    if (rest.length === 0)
      return first;
    else
      return Goal.both(first, Goal.all(...rest));
  }
}

Goal.eq  = Goal.equal;
Goal.or  = Goal.either;
Goal.and = Goal.both;
