export function interleave(...streams) {
  let stream, next;

  return function*() {
    while (streams.length > 0) {
      stream = streams.shift();
      next   = stream.next();

      if (!next.done) {
        yield next.value;
        streams.push(stream);
      }
    }
  }();
};
