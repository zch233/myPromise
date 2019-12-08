export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('必须传入函数')
  this.resolve = () => {}
  this.reject = () => {}
  this.events = []
  fn.call(undefined, this.resolve, this.reject)
}

function isFunction(fn:any) {
  if (typeof fn !== 'function') return false
  return true
}

myPromise.prototype.then = (success: Function, fail: Function) => {
  this.events.push([success, fail])
}