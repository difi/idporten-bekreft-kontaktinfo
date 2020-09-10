import * as React from "react";
import {Switch} from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
import MissingEmail from "./pages/MissingEmail";
import EditMobile from "./pages/EditMobile";
import EditEmail from "./pages/EditEmail";

class RouteSwitch extends React.Component {

    componentDidMount() {
        console.log("RouteSwitch");

    }

    render() {
        return (
            <Switch>
                <PrivateRoute path={"/manglendeEpost"} component={MissingEmail} />
                <PrivateRoute path={"/editMobile"} component={EditMobile} />
                <PrivateRoute path={"/editEmail"} component={EditEmail} />
                <PrivateRoute path={["/", "/kontaktinfo"]} component={ConfirmKontaktinfo} />
                {/*<DefaultLayout component={NotFound} />*/}
            </Switch>
        );
    }
}

export default RouteSwitch;