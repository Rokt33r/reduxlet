import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

const returnFalse = () => false

test('areMergedPropsEqual uses shallowEqual by default', () => {
  const Container = reduxlet({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    options: {
      // Prevent rendering interception of previous matchers
      areStatesEqual: returnFalse,
      areOwnPropsEqual: returnFalse,
      areStatePropsEqual: returnFalse
    }
  })(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++

  // Fire add (shallow equal : true => should NOT render)
  container.state.actions.add()
  expectedRenderCount++
  checkRenderCount()

  // Fire doNothing (shallow equal : true => should NOT render)
  container.state.actions.doNothing()
  checkRenderCount()

  // Fire cloneState (shallow equal : true => should NOT render)
  container.state.actions.cloneState()
  checkRenderCount()
})
