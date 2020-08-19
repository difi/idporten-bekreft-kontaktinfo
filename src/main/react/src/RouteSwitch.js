import * as React from "react";
import {Switch} from "react-router-dom";
// import Login from "./pages/auth/Login";
// import LoginResponse from "./pages/auth/LoginResponse";
// import Logout from "./pages/auth/Logout";
// import LogoutResponse from "./pages/auth/LogoutResponse";
// import NotFound from "./pages/NotFound";
import PrivateRoute from "./PrivateRoute";
// import Health from "./components/Health";
import ConfirmKontaktinfo from "./pages/ConfirmKontaktinfo";
// import Home from "./pages/Home";
import ManglendeEpost from "./pages/ManglendeEpost";

class RouteSwitch extends React.Component {

    componentDidMount() {
        console.log("RouteSwitch");

    }

    render() {
        return (
            <Switch>
                <PrivateRoute path={"/manglendeEpost"} component={ManglendeEpost} />
                <PrivateRoute path={["/", "/kontaktinfo"]} component={ConfirmKontaktinfo} />
                {/*<DefaultLayout component={NotFound} />*/}
            </Switch>
        );
    }
}

export default RouteSwitch;