import React from 'react'
import reduxlet from '../src/reduxlet'
import TestUtils from 'react-dom/test-utils'
import shared from './shared'
import { compose } from 'redux'

test('if devtool true, use compose of devtool extension', () => {
  const useDevtoolsExtensionCompose = jest.fn()
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ = (...args) => {
    useDevtoolsExtensionCompose()
    return compose(...args)
  }
  const Container = reduxlet({
    devtool: true
  })(shared.DummyClassComponent)

  const onRender = () => {}

  TestUtils.renderIntoDocument(<Container onRender={onRender} />)
  expect(useDevtoolsExtensionCompose).toHaveBeenCalled()
})
