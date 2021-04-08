import React, {Component,lazy, Suspense} from 'react';
import './scss/import.scss';
import {observer} from "mobx-react";

export const silentLoadComponent = (Component: any) => (props: any) => (
    <Suspense fallback={""}>
        <Component {...props}/>
    </Suspense>
)

const Header = silentLoadComponent(lazy(() => import ("./components/Header")));
const Main = silentLoadComponent(lazy(() => import ("./components/Main")));
const Footer = silentLoadComponent(lazy(() => import ("./components/Footer")));

@observer
class App extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="app">
                    <Header/>
                    <Main />
                    <Footer/>
                </div>
            </React.Fragment>
        );
    }
}

export default App;
