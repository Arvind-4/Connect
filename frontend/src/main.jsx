import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { is_authenticated } from './store/auth'

console.log('Is Auth ', is_authenticated)

ReactDOM.render(
    <BrowserRouter>
      <App/>
    </BrowserRouter>,
    document.querySelector("#root")
)