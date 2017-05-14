import React from 'react'
import reduxlet from '../src/reduxlet'

test('if component name doesn\'t exist, use Component as a name', () => {
  const Container = reduxlet()(props => (<div>test</div>))
  expect(Container.displayName).toEqual('reduxlet(Component)')
})
