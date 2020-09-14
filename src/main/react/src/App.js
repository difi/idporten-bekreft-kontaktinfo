import React, {Component} from 'react';
import {BrowserRouter as Router} from 'react-router-dom';

// import './scss/style.build.scss';
// import './css/idporten.css';
// import './css/font-awesome.css';
// import './css/open-sans.css';
// import './css/animations.css';
// import './css/loader.css';
import './scss/import.scss';

import RouteSwitch from "./RouteSwitch";
import {inject, observer} from "mobx-react";
import ContentHeader from "./common/ContentHeader";
// import Spinner from "./components/Spinner";

// @inject("authStore")
@observer
class App extends Component {

  // componentDidMount() {
  //    this.props.authStore.loadUser();
  // }

  render() {
    // const {authStore} = this.props;

    // if(authStore.initializing) {
    //   return  <Spinner enabled={true}/>;
    // }

    return (
        <Router basename={`${process.env.PUBLIC_URL}`}>
          <RouteSwitch/>
        </Router>
    );
  }
}

export default App;
