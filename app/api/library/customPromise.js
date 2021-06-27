const { EventEmitter } = require('events');

const hookPromise = ({p, onLongSuccess, onLongFailed, time=2000}) =>
  new Promise((res, rej) => {
    createEventer(p, onLongSuccess, onLongFailed, time, (event) => {
      event.once('status', (s) => res(s));
      event.once('done', (s) => res(s));
      event.once('err', (s) => rej(s));
    });
  });
const createEventer = (p, onLongSuccess, onLongFailed, time, cb) => {
  const event = new EventEmitter();
  const promise = MakeQuerablePromise(p);
  setTimeout(() => {
    if (promise.isPending()) {
      event.emit('status', {status: 'pending'});
      promise.then(onLongSuccess).catch(onLongFailed);
    }
  }, time);
  promise.then((d) => event.emit('done', d)).catch((e) => event.emit('err', e));

  cb(event);
};

function MakeQuerablePromise(promise) {
  // Don't modify any promise that has been already modified.
  if (promise.isResolved) return promise;
  // Set initial state
  var isPending = true;
  var isRejected = false;
  var isFulfilled = false;

  // Observe the promise, saving the fulfillment in a closure scope.
  var result = promise.then(
    function (v) {
      isFulfilled = true;
      isPending = false;
      return v;
    },
    function (e) {
      isRejected = true;
      isPending = false;
      throw e;
    }
  );
  result.isFulfilled = function () {
    return isFulfilled;
  };
  result.isPending = function () {
    return isPending;
  };
  result.isRejected = function () {
    return isRejected;
  };
  return result;
}

module.exports = { hookPromise };
