import Goal from './goal';
import Pair from './pair';

const INC = {
  inspect() { return '+' }
};

const ZERO = {
  inspect() { return '0' }
};

export function fromNumber(n) {
  if (n === 0)
    return ZERO;
  else
    return new Pair(INC, fromNumber(n - 1));
}

export function toNumber(integer) {
  if (integer === ZERO)
    return 0;
  else
    return 1 + toNumber(integer.right);
}

export function add(a, b, c) {
  return Goal.either(
    Goal.both(
      Goal.eq(a, ZERO),
      Goal.eq(b, c)
    ),
    Goal.bind(['x', 'y'], (x, y) => Goal.both(
      Goal.both(
        Goal.eq(a, new Pair(INC, x)),
        Goal.eq(c, new Pair(INC, y))
      ),
      add(x, b, y)
    ))
  );
}

export function subtract(a, b, c) {
  return add(b, c, a);
}

export function multiply(a, b, c) {
  return Goal.either(
    Goal.both(
      Goal.eq(a, ZERO),
      Goal.eq(c, ZERO)
    ),
    Goal.bind(['x', 'y'], (x, y) => Goal.both(
      Goal.both(
        Goal.eq(a, new Pair(INC, x)),
        add(y, b, c)
      ),
      multiply(x, b, y)
    ))
  );
}

export function divide(a, b, c) {
  return multiply(b, c, a);
}
