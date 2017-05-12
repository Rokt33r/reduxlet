import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'

const returnFalse = () => false

test('areStatesEqual uses strictEqual by default', () => {
  const defaultState = {
    count: 0,
    data: {
      message: 'initial'
    }
  }
  const ADD = 'ADD'
  const DO_NOTHING = 'DO_NOTHING'
  const CLONE_STATE = 'CLONE_STATE'
  const UPDATE_MESSAGE = 'UPDATE_MESSAGE'
  const actions = {
    add: () => ({
      type: ADD
    }),
    doNothing: () => ({
      type: DO_NOTHING
    }),
    cloneState: () => ({
      type: CLONE_STATE
    }),
    updateMessage: (message) => ({
      type: UPDATE_MESSAGE,
      payload: message
    })
  }

  const reducer = (state, action) => {
    switch (action.type) {
      case ADD:
        return {
          ...state,
          count: state.count + 1
        }
      case CLONE_STATE:
        return {
          ...state
        }
    }
    return state
  }

  const Dummy = class extends React.Component {
    render () {
      const props = this.props
      props.onRender()
      return (
        <div>
          <span>{props.count}</span>
          <button onClick={props.onClick}>Button</button>
        </div>
      )
    }
  }
  const Container = reduxlet({
    defaultState,
    actions,
    reducer,
    options: {
      // Prevent rendering interception of next matchers
      areStatePropsEqual: returnFalse,
      areMergedPropsEqual: returnFalse
    }
  })(Dummy)

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

  // Fire doNothing (strict equal : true => should NOT render)
  container.state.actions.doNothing()
  checkRenderCount()

  // Fire cloneState (strict equal : false => should render)
  container.state.actions.cloneState()
  expectedRenderCount++
  checkRenderCount()
})
