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
    render() {
        return (
            <Switch>
                {/*<Route exact path="/health" component={Health} />*/}
                {/*<DefaultLayout exact path="/login/response" component={LoginResponse} />*/}
                {/*<DefaultLayout exact path="/login" component={Login} />*/}
                {/*<DefaultLayout exact patfh="/logout" component={Logout} />*/}
                {/*<DefaultLayout exact path="/logout/response" component={LogoutResponse} />*/}
                {/*<PrivateRoute exact path="/" component={Home} />*/}
                <PrivateRoute path={["/", "/kontaktinfo"]} component={Kontaktinfo} />
                <PrivateRoute path={["/manglendeEpost"]} component={ManglendeEpost} />
                {/*<PrivateRoute exact path="/manglendeEpost" component={ManglendeEpost} />*/}
                {/*<DefaultLayout component={NotFound} />*/}
            </Switch>
        );
    }
}

export default RouteSwitch;