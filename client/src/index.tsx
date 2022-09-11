/* eslint-disable no-console */
import React from "react"

import ReactDOM from "react-dom/client"

import "./index.css"
import { App } from "./App"
import { CoreProvider } from "./app/core-context"
import { init } from "./app/init"
import reportWebVitals from "./reportWebVitals"

init().catch((error) => console.error(error, "caught error initting"))

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
)

root.render(
  <CoreProvider>
    <App />
  </CoreProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
