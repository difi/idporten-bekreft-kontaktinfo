import React, {Suspense,lazy} from "react";
import {withRouter} from 'react-router';
import {Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DigdirLoading from "./common/DigdirLoading";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
import EditMobile from "./pages/EditMobile";
import EditEmail from "./pages/EditEmail";
import {inject} from "mobx-react";
import { trackPromise } from 'react-promise-tracker';
import { usePromiseTracker } from "react-promise-tracker";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading />}>
        <Component {...props}/>
    </Suspense>
)

const Create = load(lazy(() => import ("./pages/Create")));
const MissingMobile = load(lazy(() => import ("./pages/MissingMobile")));
const MissingEmail = load(lazy(() => import ("./pages/MissingEmail")));

const LoadApplicationPages = props => {
    
    const { promiseInProgress } = usePromiseTracker();

    if(promiseInProgress){
        return <DigdirLoading />
    } else {
        return <Switch>
            <PrivateRoute path={"/createEmail"} component={MissingEmail}/>
            <PrivateRoute path={"/createMobile"} component={MissingMobile}/>
            <PrivateRoute path={"/create"} component={Create}/>
            <PrivateRoute path={"/editMobile"} component={EditMobile}/>
            <PrivateRoute path={"/editEmail"} component={EditEmail}/>
            <PrivateRoute path={["/", "/kontaktinfo"]} component={ConfirmKontaktinfo}/>
            {/*<DefaultLayout component={NotFound} />*/}
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
        let {kontaktinfoStore} = this.props;

        let language = new URLSearchParams(this.props.location.search).getAll("lng").toString();
        if(!kontaktinfoStore.language) {
            kontaktinfoStore.setLanguage(language)
        }

        return (
            <React.Fragment>
                <LoadApplicationPages/>
            </React.Fragment>
        );
    }
}

export default withRouter(RouteSwitch);