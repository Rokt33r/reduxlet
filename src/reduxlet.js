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
  defaultState = {},
  store,
  reducer = x => x,
  actions = {},
  mapStateToProps = state => state,
  dispatchMapProps = (dispatch, actions) => ({
    dispatch,
    actions: bindActionCreators(actions, dispatch)
  }),
  mergeProps = (stateProps, dispatchProps, ownProps) => ({...stateProps, ...dispatchProps, ...ownProps}),
  enhancers = [],
  middleware = [],
  didMount = () => {},
  willUnmount = () => {},
  options = {},
  devtool = false
} = {}) => {
  return (Component) => {
    const pure = typeof options.pure === 'undefined' ? true : options.pure
    const areStatesEqual = pure
      ? typeof options.areStatesEqual === 'undefined' ? strictEqual : options.areStatesEqual
      : returnFalse
    if (typeof areStatesEqual !== 'function') throw new TypeError('options.areStatesEqual must be function.')
    const areOwnPropsEqual = pure
      ? typeof options.areOwnPropsEqual === 'undefined' ? shallowEqual : options.areOwnPropsEqual
      : returnFalse
    if (typeof areStatesEqual !== 'function') throw new TypeError('options.areOwnPropsEqual must be function.')
    const areStatePropsEqual = pure
      ? typeof options.areStatePropsEqual === 'undefined' ? shallowEqual : options.areStatePropsEqual
      : returnFalse
    if (typeof areStatesEqual !== 'function') throw new TypeError('options.areStatePropsEqual must be function.')
    const areMergedPropsEqual = pure
      ? typeof options.areMergedPropsEqual === 'undefined' ? shallowEqual : options.areMergedPropsEqual
      : returnFalse
    if (typeof areStatesEqual !== 'function') throw new TypeError('options.areMergedPropsEqual must be function.')

    const compose = (devtool && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || pureCompose

    class ReduxletWrapper extends React.Component {
      constructor (props) {
        super(props)
        this.store = props.store == null
          ? createStore(
            reducer,
            defaultState,
            compose(
              ...enhancers,
              applyMiddleware(...middleware)
            )
          )
          : props.store

        this.dispatchMapProps = dispatchMapProps(::this.dispatch, actions)
        this.state = this.forgeState(props, this.store.getState())
      }

      componentDidMount () {
        didMount(this.store)
      }

      componentWillUnmount () {
        willUnmount(this.store)
      }

      componentWillReceiveProps (nextProps) {
        // Check ownProps (Shallow Equal by default)
        if (areOwnPropsEqual(nextProps, this.props)) {
          return
        }
        this.setState(this.forgeState(nextProps, this.store.getState(), true))
      }

      forgeState (ownProps, storeState, didOwnPropsChanged = false) {
        const mappedStateProps = mapStateToProps(storeState)
        // Check stateProps (Shallow Equal by default)
        // If ownProps changed, merge props anyway
        if (!didOwnPropsChanged && areStatePropsEqual(this.prevStateProps, mappedStateProps)) {
          return this.state
        }
        this.prevStateProps = mappedStateProps

        return mergeProps(
          mappedStateProps,
          this.dispatchMapProps,
          ownProps
        )
      }

      dispatch (action) {
        const prevStoreState = this.store.getState()
        this.store.dispatch(action)
        const newStoreState = this.store.getState()

        // Check states (Strict Equal by default)
        if (areStatesEqual(prevStoreState, newStoreState)) {
          console.log('strict equal')
          return
        }
        // Check mergedProps (Shallow Equal by default)
        const newState = this.forgeState(this.props, newStoreState)
        if (areMergedPropsEqual(this.state, this.newState)) {
          console.log('shallow equal for merged props')
          return
        }

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
