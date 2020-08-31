import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import App from './App';
import {Provider} from "mobx-react";
import * as serviceWorker from './serviceWorker';
import kontaktinfoStore from "./stores/KontaktinfoStore";
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {SnackbarProvider} from "notistack";
import MainStore from "./stores/MainStore";

import './i18n';

const stores = {
    kontaktinfoStore
};

// api url
export const SERVER_API_URL = (process.env.NODE_ENV === 'development') ? "https://eid-atest-web01.dmz.local" : ""; //"http://localhost:8080" "https://eid-atest-web01.dmz.local"
export const API_BASE_URL = SERVER_API_URL + "/idporten-bekreft-kontaktinfo/api";

// Only import dev tools if we are outside production build, else just use Fragment
// const DevTools = (process.env.NODE_ENV === 'development') ? require('mobx-react-devtools').default : Fragment;

// theme
const breakpointValues = {xs: 0, sm: 576, md: 768, lg: 992, xl: 1200};
const theme = createMuiTheme({
    breakpoints: {
        values: breakpointValues
    },
});

ReactDOM.render(
    <Fragment>
        <Provider {...new MainStore()}>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <App />
                </SnackbarProvider>
            </ThemeProvider>
        </Provider>
    </Fragment>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
