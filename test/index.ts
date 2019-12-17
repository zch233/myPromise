import * as chai from 'chai'
import * as sinon from 'sinon'
import * as sinonChai from 'sinon-chai'
import myPromise from '../src'

chai.use(sinonChai)

const assert = chai.assert
describe('myPromise', () => {
  it('是一个函数', () => {
    assert.isFunction(myPromise)
  })
  it('只允许接受一个函数当参数', () => {
    assert.doesNotThrow(() => {
      new myPromise(() => {})
    })
    assert.throw(() => {
      // @ts-ignore
      new myPromise(1)
    })
    assert.throw(() => {
      // @ts-ignore
      new myPromise()
    })
  })
  it('接受函数并会立即调用这个函数', () => {
    const called = sinon.fake()
    new myPromise(called)
    assert(called.called)
  })
  it('拥有一个 then 方法', () => {
    const promise = new myPromise(() => {})
    assert.isFunction(promise.then)
  })
  it('接受的函数有两个参数，分别是 resolve 和 reject', () => {
    new myPromise((resolve: Function, reject: Function) => {
      assert.isFunction(resolve)
      assert.isFunction(reject)
    })
  })
  it('执行 resolve 以后会执行 then 里的 success 函数', (done) => {
    const called = sinon.fake()
    const promise = new myPromise((resolve: Function) => {
      resolve()
      setTimeout(() => {
        assert(called.called)
        done()
      })
    })
    promise.then(called)
  })
  it('执行 reject 以后会执行 then 里的 fail 函数', (done) => {
    const called = sinon.fake()
    const promise = new myPromise((resolve: Function, reject: Function) => {
      reject()
      setTimeout(() => {
        assert(called.called)
        done()
      })
    })
    promise.then(null, called)
  })
  it('resolve 可以给 success 传值', (done) => {
    const called = sinon.fake()
    const promise = new myPromise((resolve: Function) => {
      resolve('zch')
      setTimeout(() => {
        assert(called.calledWith('zch'))
        done()
      })
    })
    promise.then(called)
  })
  it('reject 可以给 fail 传值', (done) => {
    const called = sinon.fake()
    const promise = new myPromise((resolve: Function, reject: Function) => {
      reject('zch')
      setTimeout(() => {
        assert(called.calledWith('zch'))
        done()
      })
    })
    promise.then(null, called)
  })
  it('一个 promise 有且只有一个状态（pending，fulfilled，rejected 其中之一）', (done) => {
    const promisePending = new myPromise(() => {})
    const promiseFulfilled = new myPromise((resolve) => {
      resolve()
    })
    const promiseRejected = new myPromise((resolve, reject) => {
      reject()
    })
    assert(promisePending.status === 'pending')
    assert(promiseFulfilled.status === 'pending')
    assert(promiseFulfilled.status !== 'fulfilled')
    assert(promiseFulfilled.status !== 'rejected')
    assert(promiseRejected.status === 'pending')
    assert(promiseRejected.status !== 'fulfilled')
    assert(promiseRejected.status !== 'rejected')
    setTimeout(() => {
      assert(promiseFulfilled.status === 'fulfilled')
      assert(promiseRejected.status === 'rejected')
      done()
    })
  })
  describe('2.2.1 onFulfilled 和 onRejected 都是可选参数', () => {
    it('2.2.1.1 如果 onFulfilled 不是函数，它会被忽略', () => {
      const promise = new myPromise((resolve) => resolve())
      assert.doesNotThrow(() => {
        promise.then()
      })
    })
    it('2.2.1.1 如果 onFulfilled 不是函数，它会被忽略', () => {
      const promise = new myPromise((resolve, reject) => reject())
      assert.doesNotThrow(() => {
        promise.then(null, 2333)
      })
    })
  })
  describe('2.2.2 如果 onFulfilled 是一个函数', () => {
    it('2.2.2.1 它一定是在 promise 是 fulfilled 状态后调用，并且接受一个参数 value', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve) => {
        assert.isFalse(called.calledWith('zch'))
        resolve('zch')
        setTimeout(() => {
          assert(called.calledWith('zch'))
          done()
        })
      })
      promise.then(called)
    })
    it('2.2.2.2 它一定是在 promise 是 fulfilled 状态后调用', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve) => {
        assert.isFalse(called.calledWith('zch'))
        resolve('zch')
        setTimeout(() => {
          assert(called.calledWith('zch'))
          done()
        })
      })
      promise.then(called)
    })
    it('2.2.2.3 它最多被调用一次', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve) => {
        resolve('zch1')
        resolve('zch2')
        setTimeout(() => {
          assert(called.calledOnce)
          assert(called.calledWith('zch1'))
          done()
        })
      })
      promise.then(called)
    })
  })
  describe('2.2.3 如果 onRejected 是一个函数', () => {
    it('2.2.3.1 它一定在 promise 是 rejected 状态后调用，并且接受一个参数 reason', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve, reject) => {
        assert.isFalse(called.calledWith('zch'))
        reject('zch')
        setTimeout(() => {
          assert(called.calledWith('zch'))
          done()
        })
      })
      promise.then(null, called)
    })
    it('2.2.3.2 它一定在 promise 是 rejected 状态后调用', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve, reject) => {
        assert.isFalse(called.calledWith('zch'))
        reject('zch')
        setTimeout(() => {
          assert(called.calledWith('zch'))
          done()
        })
      })
      promise.then(null, called)
    })
    it('2.2.2.3 它最多被调用一次', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve, reject) => {
        reject('zch1')
        reject('zch2')
        setTimeout(() => {
          assert(called.calledOnce)
          assert(called.calledWith('zch1'))
          done()
        })
      })
      promise.then(null, called)
    })
  })
  describe('2.2.4 onFulfilled 或 onRejected 只在执行环境堆栈只包含平台代码之后调用 [3.1]', () => {
    it('即：在我的代码执行完之前，不能调用 then 后面的 success 函数', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve) => {
        resolve('zch')
      })
      promise.then(called)
      assert.isFalse(called.calledWith('zch'))
      setTimeout(() => {
        assert(called.calledWith('zch'))
        done()
      })
    })
    it('即：在我的代码执行完之前，不能调用 then 后面的 fail 函数', (done) => {
      const called = sinon.fake()
      const promise = new myPromise((resolve, reject) => {
        reject('zch')
      })
      promise.then(null, called)
      assert.isFalse(called.calledWith('zch'))
      setTimeout(() => {
        assert(called.calledWith('zch'))
        done()
      })
    })
  })
  describe('2.2.5 onFulfilled 和 onRejected 会作为函数形式调用 (也就是说，默认 this 指向 global，严格模式 undefined)', () => {
    it('then 的 success 中的 this 指向 undefined', (done) => {
      const promise = new myPromise((resolve) => resolve())
      promise.then(function () {
        assert.isUndefined(this)
        done()
      })
    })
    it('then 的 fail 中的 this 指向 undefined', (done) => {
      const promise = new myPromise((resolve, reject) => reject())
      promise.then(null, function () {
        assert.isUndefined(this)
        done()
      })
    })
  })
  describe('2.2.6 在同一个 promise 实例中，then 可以链式调用多次', () => {
    it('2.2.6.1 如果或当 promise 转态是 fulfilled 时，所有的 onFulfilled 回调回以他们注册时的顺序依次执行', (done) => {
      const called1 = sinon.fake()
      const called2 = sinon.fake()
      const called3 = sinon.fake()
      const promise = new myPromise((resolve) => resolve('zch'))
      promise.then(called1)
      promise.then(called2)
      promise.then(called3)
      setTimeout(() => {
        assert(called1.called)
        assert(called2.called)
        assert(called3.called)
        assert(called2.calledAfter(called1))
        assert(called3.calledAfter(called2))
        done()
      })
    })
    it('2.2.6.2 如果或当 promise 转态是 rejected 时，所有的 onRejected 回调回以他们注册时的顺序依次执行', (done) => {
      const called1 = sinon.fake()
      const called2 = sinon.fake()
      const called3 = sinon.fake()
      const promise = new myPromise((resolve, reject) => reject('zch'))
      promise.then(null, called1)
      promise.then(null, called2)
      promise.then(null, called3)
      setTimeout(() => {
        assert(called1.called)
        assert(called2.called)
        assert(called3.called)
        assert(called2.calledAfter(called1))
        assert(called3.calledAfter(called2))
        done()
      })
    })
  })
  describe('2.2.7', () => {
    it('then 方法一定返回一个 promise', () => {
      const promise = new myPromise((resolve) => {
        resolve()
      })
      const promise2 = promise.then()
      assert(promise2 instanceof myPromise)
    })
    it('2.2.7.1. 如果 onFulfilled 或 onRejected 函数返回值为x，那么执行Promise处理过程 [[Resolve]](promise2, x) ', () => {
      const promise1 = new myPromise((resolve) => {resolve()})
      promise1.then(() => 'zch').then((result) => {
        assert(result === 'zch')
      })
      const promise2 = new myPromise((resolve, reject) => {reject()})
      promise2.then(null, () => 'zch').then((result) => {
        assert(result === 'zch')
      })
    })
    it('2.2.7.1.2 success 的返回值是一个 promise 实例且成功了，', (done) => {
      const promise = new myPromise((resolve) => resolve())
      const x = promise.then(() => new myPromise((resolve) => resolve()))
      const called = sinon.fake()
      x.then(called)
      setTimeout(() => {
        assert(called.called)
        done()
      })
    })
    it('2.2.7.1.3 fail 的返回值是一个 promise 实例且失败了', (done) => {
      const promise = new myPromise((resolve, reject) => reject())
      const x = promise.then(null, () => new myPromise((resolve) => resolve()))
      const called = sinon.fake()
      x.then(called)
      setTimeout(() => {
        assert(called.called)
        done()
      })
    })
    it('2.2.7.1.4 的第一个promise的 success then抛出错误，下一个then必须调用fail', (done) => {
      const promise = new myPromise((resolve) => resolve())
      const error = new Error('错误')
      const x = promise.then(() => {
        throw error
      })
      const called = sinon.fake()
      x.then(null, called)
      setTimeout(() => {
        assert(called.called)
        assert(called.calledWith(error))
        done()
      })
    })
    it('2.2.7.1.5 的第一个promise的 fail then抛出错误，下一个then必须调用fail', (done) => {
      const promise = new myPromise((resolve, reject) => reject())
      const error = new Error('错误')
      const x = promise.then(null, () => {
        throw error
      })
      const called = sinon.fake()
      x.then(null, called)
      setTimeout(() => {
        assert(called.called)
        assert(called.calledWith(error))
        done()
      })
    })
  })
})
