import reduxlet from '../src/reduxlet'
import shared from './shared'

test('reduxlet should throw error', () => {
  expect(() => {
    reduxlet({
      options: {
        areStatesEqual: 'Not a function'
      }
    })(shared.DummyClassComponent)
  }).toThrow()

  expect(() => {
    reduxlet({
      options: {
        areOwnPropsEqual: 'Not a function'
      }
    })(shared.DummyClassComponent)
  }).toThrow()

  expect(() => {
    reduxlet({
      options: {
        areStatePropsEqual: 'Not a function'
      }
    })(shared.DummyClassComponent)
  }).toThrow()

  expect(() => {
    reduxlet({
      options: {
        areMergedPropsEqual: 'Not a function'
      }
    })(shared.DummyClassComponent)
  }).toThrow()
})
