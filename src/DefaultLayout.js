import React, {Component, Fragment} from 'react';
import Header from "./components/Header";
import Footer from "./components/Footer";
import {Route} from "react-router-dom";

class DefaultLayout extends Component {

    render() {
        const {component: Component, ...rest} = this.props;
        return (
            <Route {...rest} render={ (props) => (
                <Fragment>
                    <Header />
                    <Component {...props} />
                    <Footer />
                </Fragment>
                )}
            />
        )
    }
}

export default DefaultLayout;