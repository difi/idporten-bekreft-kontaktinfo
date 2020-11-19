import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import DigdirLoading from "../common/DigdirLoading";

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
                        <Router basename={`${process.env.PUBLIC_URL}`}>
                            <RouteSwitch/>
                        </Router>
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Application;
