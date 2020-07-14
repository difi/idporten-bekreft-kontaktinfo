import React, {Component, Suspense} from 'react';
// import Header from "./components/Header";
// import Footer from "./components/Footer";
import {Route} from "react-router-dom";
import SimpleBackdrop from "./common/SimpleBackdrop";

class DefaultLayout extends Component {

    render() {
        const {component: Component, ...rest} = this.props;
        return (
            <Route {...rest} render={ (props) => (
                <Suspense fallback={<SimpleBackdrop />}>
                    {/*<Header />*/}
                    <Component {...props} />
                    {/*<Footer />*/}
                </Suspense>
                )}
            />
        )
    }
}

export default DefaultLayout;