import React, {Fragment} from 'react';
import ReactDOM from 'react-dom';
import './scss/import.scss';
import App from './App';
import {Provider} from "mobx-react";
import * as serviceWorker from './serviceWorker';
import {createMuiTheme} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/styles";
import {SnackbarProvider} from "notistack";
import MainStore from "./stores/MainStore";
import axios from "axios";
import './i18n';

// api url
export const SERVER_API_URL = (process.env.NODE_ENV === 'development') ? "http://localhost:8080" : ""; //"http://localhost:8080" "https://eid-atest-web01.dmz.local"
let apiPath = (process.env.NODE_ENV === 'development') ? "/api" : "/idporten-bekreft-kontaktinfo/api";
export const API_BASE_URL = SERVER_API_URL + apiPath;

// Only import dev tools if we are outside production build, else just use Fragment
// const DevTools = (process.env.NODE_ENV === 'development') ? require('mobx-react-devtools').default : Fragment;

// default options for axios
axios.defaults.withCredentials = true;

// theme
const breakpointValues = {xs: 0, sm: 576, md: 768, lg: 992, xl: 1200};
const theme = createMuiTheme({
    breakpoints: {
        values: breakpointValues
    },
});

ReactDOM.render(
    <div>
        <Fragment>
            <Provider {...new MainStore()}>
                <ThemeProvider theme={theme}>
                    <SnackbarProvider maxSnack={3}>
                        <App />
                    </SnackbarProvider>
                </ThemeProvider>
            </Provider>
        </Fragment>
    </div>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
