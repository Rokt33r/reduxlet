import babel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/reduxlet.js',
  plugins: [
    commonjs(),
    resolve({
      module: true,
      main: false
    }),
    babel()
  ],
  moduleName: 'reduxlet',
  external: [
    'react',
    'redux'
  ],
  globals: {
    react: 'React',
    redux: 'Redux',
    shallowEqual: 'shallowEqual'
  },
  targets: [
    { dest: 'lib/reduxlet.js', format: 'cjs' },
    { dest: 'dist/reduxlet.js', format: 'umd' },
    { dest: 'es/reduxlet.js', format: 'es' }
  ]
}
