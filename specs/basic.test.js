import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('basic behaviour of reduxlet', () => {
  const enhancerMock = jest.fn()
  const enhancer = createStore => (reducer, preloadedState) => {
    enhancerMock(reducer, preloadedState)
    return {
      ...createStore(reducer, preloadedState)
    }
  }

  const middlewareMock = jest.fn()
  const middleware = middleWareAPI => next => action => {
    middlewareMock(action)
    return next(action)
  }

  const Container = reduxlet({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    middlewares: [middleware],
    enhancers: [enhancer]
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

  // Dispatch doNothing (No changes => should NOT render)
  container.state.actions.doNothing()
  checkRenderCount()

  // Dispatch cloneState (No changes => should NOT render)
  container.state.actions.cloneState()
  checkRenderCount()

  // Fire updateMessage (data.message changed => should render)
  container.state.actions.updateMessage('second')
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.data.message).toEqual('second')
  expect(container.component.props.data.message).toEqual('second')

  // Check our mock middleware got proper arguments
  expect(middlewareMock).toHaveBeenCalledWith(shared.actions.add())
  expect(middlewareMock).toHaveBeenCalledWith(shared.actions.updateMessage('second'))
})
