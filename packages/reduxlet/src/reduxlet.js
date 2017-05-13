import React from 'react'
import {
  createStore,
  applyMiddleware,
  compose as pureCompose,
  bindActionCreators
} from 'redux'
import shallowEqual from 'react-redux/lib/utils/shallowEqual'

const strictEqual = (a, b) => a === b
// Don't compare, just return false always for a non-pure component
const returnFalse = () => false

const ReduxletCreator = ({
  defaultState,
  store,
  reducer = state => state,
  actions = {},
  mapStateToProps = state => state,
  dispatchMapProps = (dispatch, actions) => ({
    dispatch,
    actions: bindActionCreators(actions, dispatch)
  }),
  mergeProps = (stateProps, dispatchProps, ownProps) => ({...stateProps, ...dispatchProps, ...ownProps}),
  enhancers = [],
  middlewares = [],
  didMount = store => {},
  willUnmount = store => {},
  options = {},
  devtool = false
} = {}) => {
  return (Component) => {
    const pure = typeof options.pure === 'undefined' ? true : options.pure
    const areStatesEqual = pure
      ? typeof options.areStatesEqual === 'undefined' ? strictEqual : options.areStatesEqual
      : returnFalse
    if (typeof areStatesEqual !== 'function') throw new TypeError('[Reduxlet] options.areStatesEqual must be function.')
    const areOwnPropsEqual = pure
      ? typeof options.areOwnPropsEqual === 'undefined' ? shallowEqual : options.areOwnPropsEqual
      : returnFalse
    if (typeof areOwnPropsEqual !== 'function') throw new TypeError('[Reduxlet] options.areOwnPropsEqual must be function.')
    const areStatePropsEqual = pure
      ? typeof options.areStatePropsEqual === 'undefined' ? shallowEqual : options.areStatePropsEqual
      : returnFalse
    if (typeof areStatePropsEqual !== 'function') throw new TypeError('[Reduxlet] options.areStatePropsEqual must be function.')
    const areMergedPropsEqual = pure
      ? typeof options.areMergedPropsEqual === 'undefined' ? shallowEqual : options.areMergedPropsEqual
      : returnFalse
    if (typeof areMergedPropsEqual !== 'function') throw new TypeError('[Reduxlet] options.areMergedPropsEqual must be function.')

    const compose = (devtool && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || pureCompose

    class ReduxletWrapper extends React.Component {
      constructor (props) {
        super(props)
        this.store = store == null
          ? createStore(
            reducer,
            defaultState,
            compose(
              ...enhancers,
              applyMiddleware(...middlewares)
            )
          )
          : store

        this.dispatch = ::this.dispatch
        this.onDispatch = ::this.onDispatch
        this.dispatchMapProps = dispatchMapProps(this.dispatch, actions)
        const storeState = this.prevStoreState = this.store.getState()
        const mappedStateProps = this.prevStateProps = mapStateToProps(storeState)
        this.state = this.forgeState(mappedStateProps, props)
      }

      componentDidMount () {
        this.unsubscribe = this.store.subscribe(this.onDispatch)
        didMount.call(this, this.store)
      }

      componentWillUnmount () {
        this.unsubscribe()
        willUnmount.call(this, this.store)
      }

      shouldComponentUpdate (nextProps, nextState) {
        return !areMergedPropsEqual(this.state, nextState)
      }

      componentWillReceiveProps (nextProps) {
        // Check ownProps (Shallow Equal by default)
        if (!areOwnPropsEqual(nextProps, this.props)) {
          const newState = this.forgeState(this.prevStateProps, nextProps)
          this.setState(newState)
        }
      }

      forgeState (mappedStateProps, ownProps) {
        return mergeProps(
          mappedStateProps,
          this.dispatchMapProps,
          ownProps
        )
      }

      dispatch (action) {
        this.prevStoreState = this.store.getState()
        this.store.dispatch(action)
      }

      onDispatch () {
        // Check states (Strict Equal by default)
        const newStoreState = this.store.getState()
        if (areStatesEqual(this.prevStoreState, newStoreState)) {
          return
        }

        // Check stateProps (Shallow Equal by default)
        const mappedStateProps = mapStateToProps(newStoreState)
        if (areStatePropsEqual(this.prevStateProps, mappedStateProps)) {
          return
        }
        this.prevStateProps = mappedStateProps

        const newState = this.forgeState(newStoreState, this.props)
        this.setState(newState)
      }

      render () {
        return <Component
          ref={component => (this.component = component)}
          {...this.state}
        />
      }
    }

    const componentName = Component.displayName || Component.name || 'Component'
    ReduxletWrapper.displayName = `reduxlet(${componentName})`

    return ReduxletWrapper
  }
}

export default ReduxletCreator
