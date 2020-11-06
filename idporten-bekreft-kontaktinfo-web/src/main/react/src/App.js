import React, {Component,lazy, Suspense} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

import './scss/import.scss';
import {observer} from "mobx-react";
import DigdirLoading from "./common/DigdirLoading";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading />}>
        <Component {...props}/>
    </Suspense>
)

const RouteSwitch = load(lazy(() => import ("./RouteSwitch")));

@observer
class App extends Component {

  render() {

    return (
        <Router basename={`${process.env.PUBLIC_URL}`}>
          <RouteSwitch/>
        </Router>
    );
  }
}

export default App;
