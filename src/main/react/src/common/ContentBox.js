import React, {Component} from "react";

import {Paper, withStyles} from "@material-ui/core";
import ContentStepper from "./ContentStepper";
import ContentHeader from "./ContentHeader";
import ContentFooter from "./ContentFooter";
import {inject, observer} from "mobx-react";
import {Route, Switch, withRouter} from "react-router-dom";
import {TransitionGroup} from "react-transition-group";
import NotFound from "../components/NotFound";
import CSSTransition from "react-transition-group/CSSTransition";
import ConfirmKontaktinfo from "../pages/ConfirmKontaktinfo";
import ManglendeEpost from "../pages/ManglendeEpost";

const styles = (theme) => ({
    root: {
        width: "500px",
        margin: "auto",
        [theme.breakpoints.down('sm')]: {
            width: "100%",
            border: "0",
        },
    },
    transitionGroup: {
        position: "relative",
        overflow: "hidden",
    },
    routeSection: {
        width: "100%",
        height: "100%",
    },
    slideToLeftEnter: {
        zIndex: "2000",
        position: "absolute",
        animation: `$slide-in-right 250ms cubic-bezier(.25, .46, .45, .94) both`,
    },
    slideToLeftExit: {
        zIndex: "3000",
        animation: `$slide-out-left 250ms cubic-bezier(.55, .085, .68, .53) both`,
    },
    slideToRightEnter: {
        zIndex: "2000",
        position: "absolute",
        animation: `$slide-in-left 250ms cubic-bezier(.25, .46, .45, .94) both`,
    },
    slideToRightExit: {
        zIndex: "3000",
        animation: `$slide-out-right 250ms cubic-bezier(.55, .085, .68, .53) both`,
    },
    "@keyframes slide-in-right": {
        "0%": {
            transform: "translateX(1000px)",
            opacity: "0",
        },
        "100%": {
            transform: "translateX(0)",
            opacity: "1",
        }
    },
    "@keyframes slide-out-left": {
        "0%": {
            transform: "translateX(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateX(-1000px)",
            opacity: "0",
        }
    },
    "@keyframes slide-out-right": {
        "0%": {
            transform: "translateX(0)",
            opacity: "1",
        },
        "100%": {
            transform: "translateX(1000px)",
            opacity: "0",
        }
    },
    "@keyframes slide-in-left": {
        "0%": {
            transform: "translateX(-1000px)",
            opacity: "0",
        },
        "100%": {
            transform: "translateX(0)",
            opacity: "1",
        }
    },
});

@withRouter
@inject("uiStore")
@observer
class ContentBox extends Component {

    render() {
        const {classes, location} = this.props;

        const currentScreen = location.pathname.split("/")[2] || 1;
        const {state} = location;
        const previousScreen = state ? state.previousScreen : 1;
        const animationClass = currentScreen > previousScreen
            ? {
                enter: classes.slideToLeftEnter,
                exit: classes.slideToLeftExit,
            }
            : {
                enter: classes.slideToRightEnter,
                exit: classes.slideToRightExit,
            }
            ;

        const transitionProps = {
            appear: false,
            classNames: animationClass,
            timeout: 250
        };

        return (
            <Paper variant="outlined" className={classes.root}>
                <ContentHeader/>
                <ContentStepper activeStep={currentScreen} />

                <TransitionGroup className={classes.transitionGroup} childFactory={child => React.cloneElement(child, transitionProps)} >
                    <CSSTransition key={location.key} timeout={250} mountOnEnter={false}>
                        <section className={classes.routeSection}>
                            <Switch location={location}>
                                <Route exact path="/" component={ConfirmKontaktinfo}/>
                                <Route exact path="/manglendeEpost" component={ManglendeEpost}/>
                                <Route exact path="/confirmKontaktinfo" component={ConfirmKontaktinfo}/>
                                <Route component={NotFound}/>
                            </Switch>
                        </section>
                    </CSSTransition>
                </TransitionGroup>

                <ContentFooter/>
            </Paper>

        );
    }

}

export default withStyles(styles)(ContentBox);
