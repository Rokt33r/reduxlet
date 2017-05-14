import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

const returnFalse = () => false

test('areStatePropsEqual uses shallowEqual by default', () => {
  const mapStateToEmptyProps = state => ({})

  const Container = reduxlet({
    // Use empty props
    mapStateToProps: mapStateToEmptyProps,
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    options: {
      // Prevent rendering interception of next matchers
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

  // Fire add (shallow equal : true => should NOT render)
  container.state.actions.add()
  checkRenderCount()
  expect(container.state.count).toBeUndefined()
  expect(container.component.props.count).toBeUndefined()
})
