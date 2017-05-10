import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

let root = document.getElementById('root')
if (root == null) {
  root = document.createElement('div')
  document.body.appendChild(root)
}

const render = (Component) => {
  ReactDOM.render(
    <Component />,
    root
  )
}

render(App)

// if (module.hot) {
//   module.hot.accept('./App', () => {
//     render(App)
//   });
// }
