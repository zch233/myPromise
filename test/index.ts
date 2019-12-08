import * as chai from 'chai'
import sinon from 'sinon'
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
    assert(called)
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
  it('执行 resolve 以后会执行 then 里的人success 函数', () => {
    const called = sinon.fake()
    const promise = new myPromise((resolve: Function) => {
      resolve()
      assert(called)
    })
    promise.then()
  })
})
