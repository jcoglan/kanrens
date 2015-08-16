import Goal from './lib/goal';
import Pair from './lib/pair';
import State from './lib/state';

import * as integer from './lib/integer';
import * as list from './lib/list';


let goal;

let [state, [x, y, z]] = new State().createVars('x', 'y', 'z');

goal = Goal.eq(x, 5);
console.log(Array.from( goal.pursue(state) ));


state = new State();


goal = Goal.bind(['x'], x => Goal.eq(x, 5));
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['x'], x =>
  Goal.either( Goal.eq(x, 5), Goal.eq(x, 6) )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['x', 'y'], (x, y) =>
  Goal.both( Goal.eq(x, 5), Goal.eq(y, 7) )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['x', 'y'], (x, y) =>
  Goal.both(
    Goal.eq(x, 5),
    Goal.either(Goal.eq(y, 6), Goal.eq(y, 7))
  )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['x'], x =>
  Goal.both( Goal.eq(x, 1), Goal.eq(2, x) )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['x', 'y'], (x, y) =>
  Goal.eq(
    new Pair(3, x),
    new Pair(y, new Pair(5, y))
  )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['a', 'b'], (a, b) =>
  Goal.eq(
    list.fromArray([1, a, 3]),
    list.fromArray([b, 2, 3])
  )
);
console.log(Array.from( goal.pursue(state) ));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.both(
      Goal.eq(a, list.fromString('hel')),
      Goal.eq(b, list.fromString('lo'))
    ),
    list.append(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(3).map(list.toString));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.both(
      Goal.eq(a, list.fromString('hel')),
      Goal.eq(c, list.fromString('hello'))
    ),
    list.append(a, b, c)
  )
);
for (let s of goal.pursue(state))
  console.log(s.results(3).map(list.toString));


goal = Goal.bind(['a', 'b'], (a, b) =>
  list.append(a, b, list.fromString('jcoglan'))
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(2).map(list.toString));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.both(
      Goal.eq(a, list.fromArray([1, 2, 3, 4, 5, 6])),
      Goal.eq(b, list.fromArray(['x', 'y', 'z']))
    ),
    list.interleave(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(3).map(list.toArray));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.eq(c, list.fromArray([1, 'x', 2, 'y', 3])),
    list.interleave(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(2).map(list.toArray));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.both(
      Goal.eq(a, list.fromArray([1, 2, 3, 4, 5, 6])),
      Goal.eq(b, list.fromArray(['x', 'y', 'z']))
    ),
    list.zip(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(3));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.eq(c, list.fromArray([new Pair(1, 'x'), new Pair(2, 'y'), new Pair(3, 'z')])),
    list.zip(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(2));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.eq(c, integer.fromNumber(3)),
    integer.add(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(2).map(integer.toNumber));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.both(
      Goal.eq(a, integer.fromNumber(24)),
      Goal.eq(b, integer.fromNumber(3))
    ),
    integer.divide(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(3).map(integer.toNumber));


goal = Goal.bind(['a', 'b', 'c'], (a, b, c) =>
  Goal.both(
    Goal.eq(c, integer.fromNumber(24)),
    integer.multiply(a, b, c)
  )
);
console.log();
for (let s of goal.pursue(state))
  console.log(s.results(2).map(integer.toNumber));
