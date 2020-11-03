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
import Validator from "./components/Validator";

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

        if(this.props.kontaktinfoStore.gotoUrl === "" || this.props.kontaktinfoStore.gotoUrl == null) {
            let gotoParam = new URLSearchParams(this.props.location.search).getAll("goto");
            kontaktinfoStore.setGotoUrl(gotoParam);
        }

        if (this.props.kontaktinfoStore.code === "" || this.props.kontaktinfoStore.code == null) {
            const personIdentifikator = new URLSearchParams(this.props.location.search).get("fnr");
            kontaktinfoStore.setCode(personIdentifikator);
        }

        if (!kontaktinfoStore.current.fnr && this.props.kontaktinfoStore.code) {
            kontaktinfoStore.fetchKontaktinfo(this.props.kontaktinfoStore.code);
        }
    }

    render() {
        return (
            <Switch>
                <PrivateRoute path={"/createEmail"} component={MissingEmail} />
                <PrivateRoute path={"/createMobile"} component={MissingMobile} />
                <PrivateRoute path={"/create"} component={Create} />
                <PrivateRoute path={"/editMobile"} component={EditMobile} />
                <PrivateRoute path={"/editEmail"} component={EditEmail} />
                <PrivateRoute path={["/", "/kontaktinfo"]} component={ConfirmKontaktinfo} />
                {/*<DefaultLayout component={NotFound} />*/}
            </Switch>
        );
    }
}

export default withRouter(RouteSwitch);