import React, {lazy} from "react";
import {withRouter} from 'react-router';
import {Switch, Route} from "react-router-dom";
import DigdirLoading from "../common/DigdirLoading";
import Confirm from "../pages/Confirm";
import EditMobile from "../pages/EditMobile";
import EditEmail from "../pages/EditEmail";
import {inject} from "mobx-react";
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";
import i18next from "i18next";
import {Helmet} from "react-helmet";
import {loadComponent} from "./Main";
const Create = loadComponent(lazy(() => import ("../pages/Create")));
const MissingMobile = loadComponent(lazy(() => import ("../pages/MissingMobile")));
const MissingEmail = loadComponent(lazy(() => import ("../pages/MissingEmail")));

const LoadApplicationPages = () => {
    
    const { promiseInProgress } = usePromiseTracker();

    if(promiseInProgress){
        return <DigdirLoading />
    } else {
        return <Switch>
            <Route path={"/createEmail"} component={MissingEmail}/>
            <Route path={"/createMobile"} component={MissingMobile}/>
            <Route path={"/create"} component={Create}/>
            <Route path={"/editMobile"} component={EditMobile}/>
            <Route path={"/editEmail"} component={EditEmail}/>
            <Route path={["/", "/kontaktinfo"]} component={Confirm}/>
        </Switch>
    }
}

@inject("kontaktinfoStore")
class RouteSwitch extends React.Component {

    componentDidMount(){
        const {kontaktinfoStore} = this.props;

        // set gotoParam
        let gotoUrl = new URLSearchParams(this.props.location.search).getAll("goto").toString();
        if(!kontaktinfoStore.gotoUrl && gotoUrl) {
            kontaktinfoStore.setGotoUrl(gotoUrl);
        }

        // set code
        let code = new URLSearchParams(this.props.location.search).getAll("code").toString();
        if (!kontaktinfoStore.code && code){
            kontaktinfoStore.setCode(code);
        }

        // if something is missing, stop.
        if(!kontaktinfoStore.code || !kontaktinfoStore.gotoUrl) {
            throw Error("no_session")
        }

        // get kontaktinfo
        if (kontaktinfoStore.code){
            trackPromise(
                kontaktinfoStore.getKontaktinfo(code)
                    .catch((error) => {
                        this.setState(() => { throw error; });
                    }));
        }
    }

    render() {
        return (
            <React.Fragment>
                <Helmet htmlAttributes={{ lang: i18next.language }}/>
                <LoadApplicationPages/>
            </React.Fragment>
        );
    }
}

export default withRouter(RouteSwitch);