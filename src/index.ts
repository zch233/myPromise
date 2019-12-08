export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('Promise resolver undefined is not a function')
  this.events = []
  fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
}

function isFunction(fn:any) {
  if (typeof fn !== 'function') return false
  return true
}

myPromise.prototype.then = function (success: Function, fail: Function) {
  this.events.push([success, fail])
}

myPromise.prototype.resolve = function () {
  setTimeout(() => {
    this.events.map((fn: [Function, Function]) => fn[0].call(undefined))
  })
}

myPromise.prototype.reject = function () {
  setTimeout(() => {
    this.events.map((fn: [Function, Function]) => fn[1].call(undefined))
  })
}