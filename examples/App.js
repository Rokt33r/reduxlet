import React from 'react'
import reduxlet from '../src/reduxlet'

const ADD = 'ADD'

const reducer = (state = {count: 0}, action) => {
  switch (action.type) {
    case ADD:
      console.log(state)
      return {
        count: state.count + 1
      }
  }
  return state
}

const actions = {
  add: () => ({type: ADD})
}

const ReduxLetContainer = reduxlet({
  reducer,
  actions
})(class ReduxLetContainer extends React.PureComponent {
  render () {
    const { actions, count } = this.props

    return <div>
      <button onClick={actions.add}>Hi {count}</button>
    </div>
  }
})

class App extends React.PureComponent {
  render () {
    return <div>
      <ReduxLetContainer />
      <ReduxLetContainer />

    </div>
  }
}

export default App
