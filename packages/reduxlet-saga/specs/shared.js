import React from 'react'

export const defaultState = {
  count: 0,
  data: {
    message: 'initial'
  }
}

export const actionTypes = {
  ADD: 'ADD',
  REQUEST_ADD: 'REQUEST_ADD',
  UPDATE_MESSAGE: 'UPDATE_MESSAGE'
}

export const actions = {
  add: () => ({
    type: actionTypes.ADD
  }),
  requestAdd: () => ({
    type: actionTypes.REQUEST_ADD
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
    case actionTypes.UPDATE_MESSAGE:
      return {
        ...state,
        data: {
          ...state.data,
          message: action.payload
        }
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
