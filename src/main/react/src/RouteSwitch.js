import * as React from "react";
import {Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
import MissingEmail from "./pages/MissingEmail";
import EditMobile from "./pages/EditMobile";
import EditEmail from "./pages/EditEmail";
import Create from "./pages/Create";
import MissingMobile from "./pages/MissingMobile";

class RouteSwitch extends React.Component {

    componentDidMount() {
        console.log("RouteSwitch");

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

export default RouteSwitch;