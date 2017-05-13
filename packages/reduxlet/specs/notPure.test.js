import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('if reduxlet is not pure, always try to re-render', () => {
  const Container = reduxlet({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    options: {
      pure: false
    }
  })(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++

  // Dispatch add (notPure => always rerender)
  container.state.actions.add()
  expectedRenderCount++
  checkRenderCount()
  expect(container.state.count).toEqual(1)
  expect(container.component.props.count).toEqual(1)

  // Dispatch doNothing (notPure => always rerender)
  container.state.actions.doNothing()
  expectedRenderCount++
  checkRenderCount()

  // Dispatch cloneState (notPure => always rerender)
  container.state.actions.cloneState()
  expectedRenderCount++
  checkRenderCount()
})
