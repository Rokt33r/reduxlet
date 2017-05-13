import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'
import { createStore } from 'redux'

test('basic behaviour of reduxlet', () => {
  const store = createStore(shared.reducer, shared.defaultState)
  const Container = reduxlet({
    store
  })(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++

  // Fire add (strict equal : false => should render)
  store.dispatch(shared.actions.add())
  expectedRenderCount++
  checkRenderCount()
  expect(store.getState().count).toEqual(1)
  expect(container.state.count).toEqual(1)
  expect(container.component.props.count).toEqual(1)

  // Fire doNothing (No changes => should NOT render)
  store.dispatch(shared.actions.doNothing())
  checkRenderCount()

  // Fire cloneState (No changes => should NOT render)
  store.dispatch(shared.actions.cloneState())
  checkRenderCount()

  // Fire updateMessage (data.message changed => should render)
  store.dispatch(shared.actions.updateMessage('second'))
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.data.message).toEqual('second')
  expect(container.component.props.data.message).toEqual('second')
})
