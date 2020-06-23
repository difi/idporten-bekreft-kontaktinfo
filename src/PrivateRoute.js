
import React, { Component } from 'react';

import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import DefaultLayout from "./DefaultLayout";

@inject("authStore")
@withRouter
@observer
class PrivateRoute extends Component {

	render() {
		const {authStore, component: Component, ...rest} = this.props;

		return <DefaultLayout {...rest} component={(props) => (
			authStore.isLoggedIn === true
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