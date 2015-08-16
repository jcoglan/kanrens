import { inspect } from 'util';

export default class Pair {
  constructor(left, right) {
    this.left  = left;
    this.right = right;
  }

  inspect() {
    return `(${ inspect(this.left) } . ${ inspect(this.right) })`;
  }
}
