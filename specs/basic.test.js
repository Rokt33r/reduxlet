import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('basic behaviour of reduxlet', () => {
  const Container = reduxlet({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer
  })(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++

  // Fire add (strict equal : false => should render)
  container.state.actions.add()
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.count).toEqual(1)
  expect(container.component.props.count).toEqual(1)

  // Fire doNothing (No changes => should NOT render)
  container.state.actions.doNothing()
  checkRenderCount()

  // Fire cloneState (No changes => should NOT render)
  container.state.actions.cloneState()
  checkRenderCount()

  // Fire updateMessage (data.message changed => should render)
  container.state.actions.updateMessage('second')
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.data.message).toEqual('second')
  expect(container.component.props.data.message).toEqual('second')
})
