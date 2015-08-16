import Goal from './goal';
import Pair from './pair';

const NULL = {
  inspect() { return '()' }
};

export function fromArray(array) {
  if (array.length === 0)
    return NULL;
  else
    return new Pair(array[0], fromArray(array.slice(1)));
}

export function toArray(list) {
  if (list === NULL)
    return [];
  else
    return [list.left].concat(toArray(list.right));
}

export function fromString(string) {
  return fromArray(string.split(''));
}

export function toString(list) {
  return toArray(list).join('');
}

export function append(a, b, c) {
  return Goal.either(
    Goal.both(
      Goal.eq(a, NULL),
      Goal.eq(b, c)
    ),
    Goal.bind(['first', 'aRest', 'cRest'], (first, aRest, cRest) =>
      Goal.all(
        Goal.eq(a, new Pair(first, aRest)),
        Goal.eq(c, new Pair(first, cRest)),
        append(aRest, b, cRest)
      )
    )
  );
}

export function interleave(a, b, c) {
  return Goal.either(
    Goal.both(
      Goal.eq(a, NULL), 
      Goal.eq(b, c)
    ),
    Goal.bind(['first', 'aRest', 'cRest'], (first, aRest, cRest) =>
      Goal.all(
        Goal.eq(a, new Pair(first, aRest)),
        Goal.eq(c, new Pair(first, cRest)),
        interleave(b, aRest, cRest)
      )
    )
  );
}

export function zip(a, b, c) {
  return Goal.any(
    Goal.both(Goal.eq(a, NULL), Goal.eq(c, NULL)),
    Goal.both(
      Goal.eq(b, NULL),
      Goal.bind(['first', 'aRest', 'cRest'], (first, aRest, cRest) =>
        Goal.all(
          Goal.eq(a, new Pair(first, aRest)),
          Goal.eq(c, new Pair(new Pair(first, NULL), cRest)),
          zip(aRest, b, cRest)
        )
      )
    ),
    Goal.bind(['aFirst', 'aRest', 'bFirst', 'bRest', 'cRest'], (aFirst, aRest, bFirst, bRest, cRest) =>
      Goal.all(
        Goal.eq(a, new Pair(aFirst, aRest)),
        Goal.eq(b, new Pair(bFirst, bRest)),
        Goal.eq(c, new Pair(new Pair(aFirst, bFirst), cRest)),
        zip(aRest, bRest, cRest)
      )
    )
  );
}
