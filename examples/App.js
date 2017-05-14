import React from 'react'
import reduxletSaga from '../packages/reduxlet-saga/src/reduxlet-saga'
import { delay } from 'redux-saga'
import { take, put } from 'redux-saga/effects'

const ADD = 'ADD'
const REQUEST_ADD = 'REQUEST_ADD'
const CANCEL = 'CANCEL'

const reducer = (state = {count: 0}, action) => {
  switch (action.type) {
    case ADD:
      return {
        count: state.count + 1
      }
  }
  return state
}

const actions = {
  add: () => ({type: ADD}),
  requestAdd: () => ({type: REQUEST_ADD}),
  cancel: () => ({type: CANCEL})
}

const saga = function * () {
  while (true) {
    yield take(REQUEST_ADD)
    yield delay(1500)
    yield put(actions.add())
  }
}

class Component extends React.PureComponent {
  render () {
    const { actions, count } = this.props

    return <div>
      <span>{count}</span>
      <button onClick={actions.add}>Add Now!</button>
      <button onClick={actions.requestAdd}>Add 1.5 secs later!</button>
    </div>
  }
}

const ReduxletComponent = reduxletSaga({
  reducer,
  actions,
  saga
})(Component)

class App extends React.PureComponent {
  render () {
    return <div>
      <ReduxletComponent />
      <ReduxletComponent />
    </div>
  }
}

export default App
