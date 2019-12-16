
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
  return new myPromise(() => {})
}

myPromise.prototype.resolve = function (value: any) {
  setTimeout(() => {
    if (this.status !== 'pending') return
    this.status = 'fulfilled'
    this.events.map((fn: [Function, Function]) => {
      if (isFunction(fn[0])) {
        fn[0].call(undefined, value)
      }
    })
  })
}

myPromise.prototype.reject = function (reason: any) {
  setTimeout(() => {
    if (this.status !== 'pending') return
    this.status = 'rejected'
    this.events.map((fn: [Function, Function]) => {
      if (isFunction(fn[1])) {
        fn[1].call(undefined, reason)
      }
    })
  })
}