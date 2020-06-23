import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import {Provider} from "mobx-react";
import * as serviceWorker from './serviceWorker';
import kontaktinfoStore from "./stores/KontaktinfoStore";

const stores = {
    kontaktinfoStore
};

// Only import dev tools if we are outside production build, else just use Fragment
const DevTools = (process.env.NODE_ENV === 'development') ? require('mobx-react-devtools').default : Fragment;

ReactDOM.render(
  <Fragment>
      <Provider {...stores} >
          <App />
      </Provider>
      <DevTools/>
  </Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
