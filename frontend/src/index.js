import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Root from './components/root'
import configureStore from './store/store';
import jwt_decode from 'jwt-decode';
import {setAuthToken} from './util/session_api_util';
import {logout} from './actions/session_actions';
import axios from 'axios'
document.addEventListener('DOMContentLoaded', () => {
    let store; 

    //if returning user has a session token in local storage
    if (localStorage.jwtToken ){
        //set token as a common header for all axios requests
        setAuthToken(localStorage.jwtToken);
        //decode token to obtain user info
        const decodedUser = jwt_decode(localStorage.jwtToken);

        //create preconfigured state we can add to store
        const preloadedState = {session: {isAuthenticated: true, user: decodedUser}}
        store = configureStore(preloadedState);
        const currentTime = Date.now() / 1000
        //if token has expired 
        if (decodedUser.exp < currentTime) {
            //logout user and redirect to home 
            store.dispatch(logout())
            window.location.href = '/login' //probably will just redirect to splash
        }
    }else {
        store = configureStore()
    }
    const root = document.getElementById('root')
    window.axios = axios;
    ReactDOM.render(<Root store={store} />, root);

})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

