const isFunction = function (fn) {
  if (typeof fn !== 'function') return false
  return true
}

const nextTick = function (fn) {
  if (process !== undefined && typeof process.nextTick === "function") {
    return process.nextTick(fn);
  } else {
    var counter = 1;
    var observer = new MutationObserver(fn);
    var textNode = document.createTextNode(String(counter));

    observer.observe(textNode, {
      characterData: true
    });

    counter = counter + 1;
    textNode.data = String(counter);
  }
}

export default function myPromise(fn: Function) {
  if (!isFunction(fn)) throw Error('Promise resolver undefined is not a function')
  this.events = []
  this.status = 'pending'
  fn.call(undefined, this.resolve.bind(this), this.reject.bind(this))
}

myPromise.prototype.then = function (success?: Function, fail?: Function) {
  const handle = []
  if (isFunction(success) || isFunction(fail)) {
    handle[0] = success
    handle[1] = fail
  }
  handle[2] = new myPromise(() => {})
  this.events.push(handle)
  return handle[2]
}

myPromise.prototype.resolve = function (value) {
  nextTick(() => {
    if (this.status !== 'pending') return
    this.status = 'fulfilled'
    this.events.map((fn) => {
      if (isFunction(fn[0])) {
        const x = fn[0].call(undefined, value)
        fn[2].resolveWith(x)
      }
    })
  })
}

myPromise.prototype.reject = function (reason) {
  nextTick(() => {
    if (this.status !== 'pending') return
    this.status = 'rejected'
    this.events.map((fn) => {
      if (isFunction(fn[1])) {
        const x = fn[1].call(undefined, reason)
        fn[2].resolveWith(x)
      }
    })
  })
}

myPromise.prototype.resolveWith = function (x) {
  if (x === this) {
    return this.reject(new TypeError())
  } else if (x instanceof myPromise) {
    // @ts-ignore
    x.then(
      result => this.resolve(result),
      reason => this.reject(reason)
    )
  } else if (x instanceof Object) {
    let then
    try {
      then = x.then
    } catch(e) {
      this.reject(e)
    }
    if (then instanceof Function) {
      try {
        then((y) => {
          this.resolveWith(y)
        }, (r) => {
          this.reject(r)
        })
      } catch (e) {
        this.reject(e)
      }
    } else {
      this.resolve(x)
    }
  } else {
    this.resolve(x)
  }
}