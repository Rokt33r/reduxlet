import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('areOwnPropsEqual uses shallowEqual by default', () => {
  const unsubscribe = jest.fn()
  const subscribe = jest.fn(() => unsubscribe)
  const mockStore = {
    dispatch: () => {},
    getState: () => ({}),
    subscribe
  }
  const Container = reduxlet({
    store: mockStore
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

  const onRender = jest.fn()

  const outer = TestUtils.renderIntoDocument(<Outer onRender={onRender} />)

  // Check if subscribe
  expect(subscribe).toHaveBeenCalled()
  expect(unsubscribe).not.toHaveBeenCalled()

  outer.setState({shouldContainerShow: false})
  // Check if unsubscribe after unmounted
  expect(unsubscribe).toHaveBeenCalled()
})
