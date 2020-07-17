import * as React from "react";
import {Route, Switch} from "react-router-dom";
// import Login from "./pages/auth/Login";
// import LoginResponse from "./pages/auth/LoginResponse";
// import Logout from "./pages/auth/Logout";
// import LogoutResponse from "./pages/auth/LogoutResponse";
// import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
// import Health from "./components/Health";
import Kontaktinfo from "./pages/ConfirmKontaktinfo";
// import Home from "./pages/Home";
import DefaultLayout from "./DefaultLayout";
import ManglendeEpost from "./pages/ManglendeEpost";

class RouteSwitch extends React.Component {

    componentDidMount() {
        console.log("Compoinent");
    }

    render() {
        return (
            <Switch>
                <PrivateRoute path={"/manglendeEpost"} component={ManglendeEpost} />
                <PrivateRoute path={["/", "/kontaktinfo"]} component={Kontaktinfo} />
                {/*<DefaultLayout component={NotFound} />*/}
            </Switch>
        );
    }
}

export default RouteSwitch;