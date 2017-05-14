import React from 'react'
import reduxletSaga from '../src/reduxlet-saga'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'
import { take, put, call } from 'redux-saga/effects'

test('task cancellation when component unmounting', () => {
  const delay = () => new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 10000)
  })

  const finishTask = jest.fn()

  const saga = function * () {
    try {
      while (true) {
        yield take(shared.actionTypes.REQUEST_ADD)
        yield call(delay)
        yield put(shared.actions.add())
      }
    } finally {
      // if task cancelled, execute finishTask
      finishTask()
    }
  }

  const didMount = jest.fn()
  const willUnmount = jest.fn()
  const Container = reduxletSaga({
    defaultState: shared.defaultState,
    actions: shared.actions,
    reducer: shared.reducer,
    didMount,
    willUnmount,
    saga
  })(shared.DummyClassComponent)

  const Outer = class Outer extends React.PureComponent {
    state = {
      shouldContainerShow: true
    }

    render () {
      const { onRender } = this.props
      const { shouldContainerShow } = this.state
      if (shouldContainerShow) {
        return <Container
          ref={container => (this.container = container)}
          onRender={onRender}
        />
      }
      return <span>Unmount!!</span>
    }
  }

  let expectedRenderCount = 0
  const onRender = jest.fn()
  const checkRenderCount = () => {
    expect(onRender).toHaveBeenCalledTimes(expectedRenderCount)
  }

  // Check if not mount yet
  expect(didMount).not.toHaveBeenCalled()

  const outer = TestUtils.renderIntoDocument(<Outer onRender={onRender} />)
  expectedRenderCount++
  checkRenderCount()
  // Check if didMount executed
  expect(didMount).toHaveBeenCalled()
  // But, willMount is not executed yet
  expect(willUnmount).not.toHaveBeenCalled()

  outer.setState({shouldContainerShow: false})
  // Now, it unmounts
  expect(willUnmount).toHaveBeenCalled()

  // Also, the saga task is finished after unmounting
  expect(finishTask).toHaveBeenCalled()
})
