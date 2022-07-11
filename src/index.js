import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './appInit/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.scss';
import {LinksApp} from "./Components/LinksApp";

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <LinksApp />
  /*<React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>*/
);

// If you want to start measuring performance in your appInit, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
