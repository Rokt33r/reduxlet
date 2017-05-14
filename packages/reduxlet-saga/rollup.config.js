import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/reduxlet-saga.js',
  plugins: [
    commonjs(),
    resolve({
      module: true,
      main: false
    }),
    babel({
      runtimeHelpers: true
    })
  ],
  moduleName: 'reduxlet',
  external: [
    'react',
    'redux',
    'redux-saga'
  ],
  globals: {
    react: 'React',
    redux: 'Redux',
    'redux-saga': 'ReduxSaga'
  },
  targets: [
    { dest: 'lib/reduxlet-saga.js', format: 'cjs' },
    { dest: 'dist/reduxlet-saga.js', format: 'umd' },
    { dest: 'es/reduxlet-saga.js', format: 'es' }
  ]
}
