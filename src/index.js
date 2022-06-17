import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/faq.css";
import "./styles/main.css";
import "./styles/Responsive.css";
import { BrowserRouter, HashRouter, Router, Route } from "react-router-dom";
import { withTracker } from "./utils/withTracker";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import { hydrate, render } from "react-dom";
const rootElement = document.getElementById("root");

// ReactDOM.render(
//     <Provider store={store}>
//         <BrowserRouter>
//             <Route component={withTracker(App)} />
//         </BrowserRouter>
//     </Provider>
//     , document.getElementById("root")
// );

if (rootElement.hasChildNodes()) {
  hydrate(
    <Provider store={store}>
      <BrowserRouter>
        <Route component={withTracker(App)} />
      </BrowserRouter>
    </Provider>,
    rootElement,
    rootElement.firstElementChild
  );
} else {
  render(
    <Provider store={store}>
      <BrowserRouter>
        <Route component={withTracker(App)} />
      </BrowserRouter>
    </Provider>,
    rootElement
  );
}
