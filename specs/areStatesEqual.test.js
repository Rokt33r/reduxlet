import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

const returnFalse = () => false

test('areStatesEqual uses strictEqual by default', () => {
  const Container = reduxlet({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    options: {
      // Prevent rendering interception of next matchers
      areStatePropsEqual: returnFalse,
      areMergedPropsEqual: returnFalse
    }
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

  // Fire doNothing (strict equal : true => should NOT render)
  container.state.actions.doNothing()
  checkRenderCount()

  // Fire cloneState (strict equal : false => should render)
  container.state.actions.cloneState()
  expectedRenderCount++
  checkRenderCount()
})
