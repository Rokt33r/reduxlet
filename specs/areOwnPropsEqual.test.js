import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'

const strictEqual = (a, b) => a === b

test('areOwnPropsEqual uses shallowEqual by default', () => {
  const Container = reduxlet({
    options: {
      areMergedPropsEqual: strictEqual
    }
  })(shared.DummyClassComponent)

  const Outer = class Outer extends React.Component {
    state = {
      number: 0,
      data: {
        message: 'initial',
        count: 0
      }
    }

    render () {
      const { onRender } = this.props
      const { number, data } = this.state
      return <Container
        ref={container => (this.container = container)}
        onRender={onRender}
        number={number}
        data={data}
      />
    }
  }

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  const outer = TestUtils.renderIntoDocument(<Outer onRender={onRender} />)
  expectedRenderCount++

  // It should rendered again if state changed
  outer.setState({number: 1})
  expectedRenderCount++
  checkRenderCount()
  expect(outer.container.props.number).toEqual(1)
  expect(outer.container.state.number).toEqual(1)
  expect(outer.container.component.props.number).toEqual(1)

  outer.setState({data: {message: 'second', count: 1}})
  expectedRenderCount++
  checkRenderCount()
  expect(outer.container.props.data.message).toEqual('second')
  expect(outer.container.state.data.message).toEqual('second')
  expect(outer.container.component.props.data.message).toEqual('second')
  expect(outer.container.props.data.count).toEqual(1)
  expect(outer.container.state.data.count).toEqual(1)
  expect(outer.container.component.props.data.count).toEqual(1)

  // It should not rendered if state is not changed after get new props
  outer.setState({number: 1})
  checkRenderCount()

  const data = outer.state.data
  outer.setState({data})
  checkRenderCount()
})
