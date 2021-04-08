import React, {Component, lazy, Suspense} from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import {withStyles} from "@material-ui/core";
import {withTranslation} from "react-i18next";
import DigdirLoading from "../common/DigdirLoading";

export const loadComponent = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading/>}>
        <Component {...props}/>
    </Suspense>
)

const RouteSwitch = loadComponent(lazy(() => import ("./RouteSwitch.js")));

class Main extends Component {

    render () {
        const { classes, t } = this.props;
        const t_title = t('title');

        return (
            <div className="main">
                <div className="box">
                    <div className={classes.main} >
                        <h2 className={classes.h2} dangerouslySetInnerHTML={{__html: `<div> ${t_title} </div>`}}/>
                        <div className={classes.providerBox}>
                        </div>
                    </div>

                    <ErrorBoundary>
                        <Router basename={`${process.env.PUBLIC_URL}`}>
                            <RouteSwitch/>
                        </Router>
                    </ErrorBoundary>
                </div>
            </div>
        );
    }
}

const styles = () => ({
    root: {
        backgroundColor: "#fff",
        padding: "2rem",
    },
    main: {
        padding: "1rem",
        borderBottom: "1px solid #e6ebf0",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "white",
        height: "28px"
    },
    sub: {
        padding: "0 1rem 0 1rem",
        borderBottom: "1px solid #e6ebf0",
        display: "flex",
        justifyContent: "space-between",
        backgroundColor: "#f7f8fa",
    },
    h2: {
        fontSize: ".875em",
        textTransform: "uppercase",
        color: "#5e6b77",
        fontWeight: 500,
        margin:0,
        lineHeight: "2.3em",
        letterSpacing: ".5px"

    },
    providerBox: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        color: "#222",
        lineHeight: "1.5em",
        letterSpacing: ".1px",
        height: "32px"
    },
    providerImage: {
        height: "2em",
    },
});

const compose = (...rest) => x => rest.reduceRight((y, f) => f(y), x);
export default compose(withStyles(styles), withTranslation())(Main);
