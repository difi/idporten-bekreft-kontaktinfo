import React, {Suspense,lazy} from "react";

import {Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
import EditMobile from "./pages/EditMobile";
import EditEmail from "./pages/EditEmail";
import DigdirLoading from "./common/DigdirLoading";

//import Create from "./pages/Create";
//import MissingMobile from "./pages/MissingMobile";
//import MissingEmail from "./pages/MissingEmail";

const load = (Component: any) => (props: any) => (
    <Suspense fallback={<DigdirLoading />}>
        <Component {...props}/>
    </Suspense>
)

//const ConfirmKontaktinfo = load(lazy(() => import ("./pages/ConfirmKontaktinfo")));
//const EditMobile = load(lazy(() => import ("./pages/EditMobile")));
//const EditEmail = load(lazy(() => import ("./pages/EditEmail")));
const Create = load(lazy(() => import ("./pages/Create")));
const MissingMobile = load(lazy(() => import ("./pages/MissingMobile")));
const MissingEmail = load(lazy(() => import ("./pages/MissingEmail")));

class RouteSwitch extends React.Component {

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

export default RouteSwitch;