import React from 'react'

export const defaultState = {
  count: 0,
  data: {
    message: 'initial'
  }
}

export const actionTypes = {
  ADD: 'ADD',
  DO_NOTHING: 'DO_NOTHING',
  CLONE_STATE: 'CLONE_STATE',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE'
}

export const actions = {
  add: () => ({
    type: actionTypes.ADD
  }),
  doNothing: () => ({
    type: actionTypes.DO_NOTHING
  }),
  cloneState: () => ({
    type: actionTypes.CLONE_STATE
  }),
  updateMessage: (message) => ({
    type: actionTypes.UPDATE_MESSAGE,
    payload: message
  })
}

export const reducer = (state, action) => {
  switch (action.type) {
    case actionTypes.ADD:
      return {
        ...state,
        count: state.count + 1
      }
    case actionTypes.CLONE_STATE:
      return {
        ...state
      }
  }
  return state
}

export const DummyClassComponent = class extends React.Component {
  render () {
    const {
      onRender,
      count,
      onClick
    } = this.props

    // Mock function to count rendering
    onRender()

    return (
      <div>
        <span>{count}</span>
        <button onClick={onClick}>Button</button>
      </div>
    )
  }
}

export default {
  defaultState,
  actionTypes,
  actions,
  reducer,
  DummyClassComponent
}
