import React from 'react'
import reduxletSaga from '../src/reduxlet-saga'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'
import { take, put, call } from 'redux-saga/effects'

test('basic behaviour of reduxlet saga', () => {
  jest.useFakeTimers()

  const enhancerMock = jest.fn()
  const createEnhancers = () => [createStore => (reducer, preloadedState) => {
    enhancerMock(reducer, preloadedState)
    return {
      ...createStore(reducer, preloadedState)
    }
  }]

  const middlewareMock = jest.fn()
  const createMiddlewares = () => [middleWareAPI => next => action => {
    middlewareMock(action)
    return next(action)
  }]

  const delay = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 10000)
  })

  const saga = function * () {
    while (true) {
      yield take(shared.actionTypes.REQUEST_ADD)
      yield call(delay)
      yield put(shared.actions.add())
    }
  }

  const Container = reduxletSaga({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    saga,
    createMiddlewares,
    createEnhancers
  })(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++
  // Check our mock enhancer got proper arguments
  expect(enhancerMock).toHaveBeenCalledWith(shared.reducer, shared.defaultState)

  // Dispatch add (strict equal : false => should render)
  container.state.actions.add()
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.count).toEqual(1)
  expect(container.component.props.count).toEqual(1)

  // Fire updateMessage (data.message changed => should render)
  container.state.actions.updateMessage('second')
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.data.message).toEqual('second')
  expect(container.component.props.data.message).toEqual('second')

  // Check our mock middleware got proper arguments
  expect(middlewareMock).toHaveBeenCalledWith(shared.actions.add())
  expect(middlewareMock).toHaveBeenCalledWith(shared.actions.updateMessage('second'))

  // Dispatch request add (pending)
  container.state.actions.requestAdd()
  checkRenderCount()
  expect(container.state.count).toEqual(1)
  expect(container.component.props.count).toEqual(1)

  // Resolve call
  jest.runAllTimers()

  // We have to wait until redux saga finish the task
  process.nextTick(() => {
    expectedRenderCount++
    checkRenderCount()
    expect(container.state.count).toEqual(2)
    expect(container.component.props.count).toEqual(2)
  })
})
