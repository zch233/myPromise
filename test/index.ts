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
  it('只允许接受一个函数当参数，并会调用这个函数', () => {
    const called = sinon.fake()
    new myPromise(called)
    assert(called)
  })
  it('拥有一个then方法', () => {
    const promise = new myPromise(() => {})
    assert.isFunction(promise.then)
  })
})
