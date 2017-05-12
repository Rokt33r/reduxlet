import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'

test('areOwnPropsEqual uses shallowEqual by default', () => {
  const Dummy = props => {
    props.onRender()
    return (
      <div>
        <span>{props.count}</span>
        <button onClick={props.onClick}>Button</button>
      </div>
    )
  }

  const Container = reduxlet()(Dummy)

  const Outer = class Outer extends React.PureComponent {
    state = {
      number: 0,
      data: {
        message: 'initial',
        count: 0
      }
    }

    render () {
      const { onRender } = this.props
      const { number, obj } = this.state
      return <Container
        onRender={onRender}
        number={number}
        obj={obj}
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

  outer.setState({data: {message: 'second', count: 1}})
  expectedRenderCount++
  checkRenderCount()

  // It should not rendered if state is not changed after get new props
  outer.setState({number: 1})
  checkRenderCount()

  const data = outer.state.data
  outer.setState({data})
  checkRenderCount()
})
