import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('basic behaviour of reduxlet with empty params', () => {
  const Container = reduxlet()(shared.DummyClassComponent)

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }
  checkRenderCount()

  const container = TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expectedRenderCount++
  checkRenderCount()

  // our reducer is NOT configured yet, it will just return same state
  container.state.dispatch({
    type: shared.actions.doNothing()
  })
  checkRenderCount()
})
