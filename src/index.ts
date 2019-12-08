export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('必须传入函数')
  this.resolve = () => {
    setTimeout(() => {
      this.events.map((fn: [Function, Function]) => fn[0].call(undefined))
    })
  }
  this.reject = () => {
    setTimeout(() => {
      this.events.map((fn: [Function, Function]) => fn[1].call(undefined))
    })
  }
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