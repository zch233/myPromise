export default function myPromise(fn: Function) {
  fn.call(this)
}

myPromise.prototype.then = () => {}