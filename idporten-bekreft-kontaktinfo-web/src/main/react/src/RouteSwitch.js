import React, {Suspense,lazy} from "react";
import {withRouter} from 'react-router';
import {Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import DigdirLoading from "./common/DigdirLoading";
import kontaktinfoStore from "./stores/KontaktinfoStore";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
import EditMobile from "./pages/EditMobile";
import EditEmail from "./pages/EditEmail";
import {inject} from "mobx-react";
import {Helmet} from "react-helmet";
//import Validator from "./components/Validator";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading />}>
        <Component {...props}/>
    </Suspense>
)

const Create = load(lazy(() => import ("./pages/Create")));
const MissingMobile = load(lazy(() => import ("./pages/MissingMobile")));
const MissingEmail = load(lazy(() => import ("./pages/MissingEmail")));

@inject("kontaktinfoStore")
class RouteSwitch extends React.Component {

    componentDidMount(){
        const {kontaktinfoStore} = this.props;

        let gotoParam = new URLSearchParams(this.props.location.search).getAll("goto").toString();
        if(!kontaktinfoStore.gotoUrl && gotoParam) {
            kontaktinfoStore.setGotoUrl(gotoParam);
        }

        const data = {
            code:new URLSearchParams(this.props.location.search).getAll("code").toString(),
            email:new URLSearchParams(this.props.location.search).getAll("email").toString(),
            mobile:new URLSearchParams(this.props.location.search).getAll("mobile").toString(),
        }

        kontaktinfoStore.setKontaktinfo(data);

        if(!kontaktinfoStore.current.code || !kontaktinfoStore.gotoUrl) {
            throw Error("no_session")
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
                <Helmet htmlAttributes={{ lang: kontaktinfoStore.language }}>
                </Helmet>
                <Switch>
                    <PrivateRoute path={"/createEmail"} component={MissingEmail}/>
                    <PrivateRoute path={"/createMobile"} component={MissingMobile}/>
                    <PrivateRoute path={"/create"} component={Create}/>
                    <PrivateRoute path={"/editMobile"} component={EditMobile}/>
                    <PrivateRoute path={"/editEmail"} component={EditEmail}/>
                    <PrivateRoute path={["/", "/kontaktinfo"]} component={ConfirmKontaktinfo}/>
                    {/*<DefaultLayout component={NotFound} />*/}
                </Switch>
            </React.Fragment>
        );
    }
}

export default withRouter(RouteSwitch);