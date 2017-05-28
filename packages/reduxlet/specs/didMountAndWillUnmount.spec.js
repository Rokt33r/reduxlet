import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'
import { createStore } from 'redux'

test('didMount and willUnmount params', () => {
  const store = createStore(shared.reducer, shared.defaultState)
  const didMount = jest.fn()
  const willUnmount = jest.fn()
  const Container = reduxlet({
    store,
    didMount,
    willUnmount
  })(shared.DummyClassComponent)

  const Outer = class Outer extends React.PureComponent {
    state = {
      shouldContainerShow: true
    }

    render () {
      const { onRender } = this.props
      const { shouldContainerShow } = this.state
      if (shouldContainerShow) {
        return <Container
          ref={container => (this.container = container)}
          onRender={onRender}
        />
      }
      return <span>Unmount!!</span>
    }
  }

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  // Check if not mount yet
  expect(didMount).not.toHaveBeenCalled()

  const outer = TestUtils.renderIntoDocument(<Outer onRender={onRender} />)
  expectedRenderCount++
  checkRenderCount()
  // Check if didMount executed
  expect(didMount).toHaveBeenCalledWith(store, {onRender})
  // But, willMount is not executed yet.
  expect(willUnmount).not.toHaveBeenCalled()

  outer.setState({shouldContainerShow: false})
  // Now, it should be unmounted
  expect(willUnmount).toHaveBeenCalledWith(store, {onRender})
})
