import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DigdirLoading from "../common/DigdirLoading";
import ErrorBoundary from "./ErrorBoundary";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading />}>
        <Component {...props}/>
    </Suspense>
)

const RouteSwitch = load(lazy(() => import ("../RouteSwitch")));

class Application extends Component {

    render () {
        return (
            <div className="app">
                <Header/>
                <div className="main">
                    <div className="box">
                        <ErrorBoundary>
                            <Router basename={`${process.env.PUBLIC_URL}`}>
                                <RouteSwitch/>
                            </Router>
                        </ErrorBoundary>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Application;
