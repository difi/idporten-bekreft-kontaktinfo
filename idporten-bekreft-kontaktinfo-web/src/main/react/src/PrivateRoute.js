import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import DefaultLayout from "./DefaultLayout";

@withRouter
@observer
class PrivateRoute extends Component {

	render() {
		const {component: Component, ...rest} = this.props;

		const isLoggedIn = true;

		return <DefaultLayout {...rest} component={(props) => (
			isLoggedIn === true
				? <Component {...props} />
				: <Redirect to={{
					pathname: '/login',
					state: { from: this.props.location.pathname }
				}}
				/>
		)}/>;
	}
}

export default PrivateRoute;