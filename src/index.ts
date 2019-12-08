
const isFunction = function (fn:any) {
  if (typeof fn !== 'function') return false
  return true
}

export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('Promise resolver undefined is not a function')
  this.events = []
  this.status = 'pending'
  fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
}

myPromise.prototype.then = function (success?: Function, fail?: Function) {
  if (isFunction(success) || isFunction(fail)) {
    this.events.push([success, fail])
  }
}

myPromise.prototype.resolve = function (data: any) {
  setTimeout(() => {
    this.status = 'fulfilled'
    this.events.map((fn: [Function, Function]) => fn[0].call(undefined, data))
  })
}

myPromise.prototype.reject = function (data: any) {
  setTimeout(() => {
    this.status = 'rejected'
    this.events.map((fn: [Function, Function]) => fn[1].call(undefined, data))
  })
}