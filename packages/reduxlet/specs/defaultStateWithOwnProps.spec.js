import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('resolve defaultState with ownProps', () => {
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

  const Container = reduxlet({
    defaultState: ownProps => ({
      ...shared.defaultState,
      count: ownProps.initCount
    }),
    actions: shared.actions,
    reducer: shared.reducer,
    createMiddlewares,
    createEnhancers
  })(shared.DummyClassComponent)

  const onRender = jest.fn()
  const container = TestUtils.renderIntoDocument(<Container initCount={100} onRender={onRender} />)

  // Dispatch add (strict equal : false => should render)
  container.state.actions.add()
  expect(container.state.count).toEqual(101)
  expect(container.component.props.count).toEqual(101)
})
