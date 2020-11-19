import React, {Component,lazy, Suspense} from 'react';
import './scss/import.scss';
import {observer} from "mobx-react";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={""}>
        <Component {...props}/>
    </Suspense>
)

const Application = load(lazy(() => import ("./components/Application")));

@observer
class App extends Component {
  render() {
    return (
        <Application />
    );
  }
}

export default App;
