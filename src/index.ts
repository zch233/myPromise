export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('必须传入函数')
  fn.call(this)
}

function isFunction(fn:any) {
  if (typeof fn !== 'function') return false
  return true
}

myPromise.prototype.then = () => {}