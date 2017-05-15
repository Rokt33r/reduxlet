import reduxlet from '../../reduxlet/src/reduxlet'
import createSagaMiddleware from 'redux-saga'

const ReduxletSagaCreator = (params = {
}) => {
  return function (Component) {
    const {
      createMiddlewares = () => [],
      didMount,
      willUnmount,
      saga
    } = params

    params.createMiddlewares = function () {
      this.sagaMiddleware = createSagaMiddleware()
      return [this.sagaMiddleware].concat(createMiddlewares())
    }

    params.didMount = function (store) {
      if (saga != null && this.sagaMiddleware != null) this.sagaTask = this.sagaMiddleware.run(saga)
      if (didMount != null) didMount(store)
    }

    params.willUnmount = function (store) {
      if (this.sagaTask != null) this.sagaTask.cancel()
      if (didMount != null) willUnmount(store)
    }

    return reduxlet(params)(Component)
  }
}

export default ReduxletSagaCreator
