import React from 'react'
import reduxletSaga from '../src/reduxlet-saga'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

test('reduxlet saga without any params', () => {
  const Container = reduxletSaga()(shared.DummyClassComponent)

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

  outer.setState({shouldContainerShow: false})
})
