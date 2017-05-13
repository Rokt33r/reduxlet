# Reduxlet

A small container component with an isolated Redux store.

## Intro

**Manage state of a component just like redux!**

Reduxlet create a redux store, which is context-free, for a single container component.
Let's use `actions` and `reducer` instead of using `this.setState`!

Also, lots of sugar is inside by default. Binding actions to dispatch, composing enhancers and applying middleware become much easier!

## Usage

Install via npm.

```sh
npm install reduxlet
```

MyContainer.jsx

```jsx
import React from 'redux'
import reduxlet from 'reduxlet'
import logger from 'redux-logger'
import persistState from 'redux-localstorage'

const actionTypes = {
  ADD: 'ADD'
}

const actions = {
  add: () => ({
    type: actionTypes.ADD
  })
}

const reducer = (state = {count: 0}, action) => {
  switch (action.type) {
    case actionTypes.ADD:
      return {
        ...state,
        count: state.count + 1
      }
  }
  return state
}

const middlewares = [
  logger
]

const enhancers = [
  persistState()
]

class MyComponent () {
  render () {
    const { count, actions } = this.props

    return (
      <div>
        <span>{count}</span>
        <button onClick={actions.add}>Add</button>
      </div>
    )
  }
}

export default reduxlet({
  actions,
  reducer,
  middlewares,
  enhancers
})(MyComponent)
```

`actions` will be bound to dispatch. But, if you want, you can define your own `mapDispatchToProps`. Check API!

For further information, please check `examples` and `specs`.

## API

### `reduxlet(params: ReduxletParams)(TargetComponent)`

All params are optional. Follow your own taste!

#### Inherent params

- `params.didMount` : A function, `store => {}`, to run after the component mount. This is good place to dispatch some initial actions.
- `params.willUnmount` : A function, `store => {}`, to run before the component unmount. Similar to `params.didMount`, you can tear down some thing before lose the instance of store.
- `params.devtool` : Connect the inner store to [redux-devtool](https://github.com/zalmoxisus/redux-devtools-extension).
**Redux Devtool can communicate only one store. So, if you trying to connect multiple stores, devtool shows only the last connected one**

#### Redux part

- `params.defaultState` : defaultState of redux store (if you provide default value to reducer, you don't need it)
- `params.reducer` : A reducer for internal redux store. you can use `combineReducer`. (default: `state=> state`)
- `params.actions` : Action creators which return action object. Reduxlet will bind these creators to the dispatch method.
- `params.middleware` : Middlewares. Reduxlet will apply these.
- `params.enhancers` : Enhancers. Reduxlet will composes these with applied middlewares.
- `params.store` : External redux store. If you provide this, `params.defaultState`, `params.reducer`, `params.middleware` and `params.enhancers` are ignored.   Almost same to `connect` of react-redux. The only difference is it doesn't access the store by `context`.

#### React Redux part

Almost same to [connect([mapStateToProps], [mapDispatchToProps], [mergeProps], [options])](https://github.com/reactjs/react-redux/blob/master/docs/api.md#connectmapstatetoprops-mapdispatchtoprops-mergeprops-options). I recommend you to check this link!

- `params.mapStateToProps` : Same to `mapStateToProps` argument of `connect`. (default: state => state)
- `params.dispatchMapProps` : Same to `dispatchMapProps` argument of `connect`. It doesn't only pass `dispatch`, also pass `actions` bound by `bindActionCreators` (default: dispatch => ({...boundActions, dispatch}))
- `params.mergeProps` : Same to `mergeProps` argument of `connect`. (default: state => state)
- `params.options` : Same to `options` argument of `connect`.
  - `params.options.pure` : If this set false, always render every dispatch and props change. So, it will ignore other options too. (default: true)
  - `params.options.areStatesEqual` : Use `strictEqual` by default
  - `params.options.areOwnPropsEqual` : Use `shallowEqual` by default
  - `params.options.areStatePropsEqual` : Use `shallowEqual` by default
  - `params.options.areMergedPropsEqual` : Use `shallowEqual` by default

## Contribution

I'm not good at English. If you find some weired expression or typos, feel free to create an issue.

## License

ISC, Junyoung Choi 2017.
