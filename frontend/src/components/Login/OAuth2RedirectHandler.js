import React, { Component } from 'react';
import { Redirect } from 'react-router-dom'
import jwt_decode from "jwt-decode";

class OAuth2RedirectHandler extends Component {
    getUrlParameter(name) {
        name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
        var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');

        var results = regex.exec(this.props.location.search);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    render() {        
        const token = this.getUrlParameter('token');
        const error = this.getUrlParameter('error');
        console.log("I did come here!!!", token, error)
        if(token) {
            localStorage.setItem("token", token);
            var decodedToken = jwt_decode(localStorage.getItem("token"));
            console.log("decodedUserId: ", decodedToken.nickName);
            localStorage.setItem("nickName", decodedToken.nickName);
            return <Redirect to={{
                pathname: "/",
                state: { from: this.props.location }
            }}/>; 
        } else {
            return <Redirect to={{
                pathname: "/login",
                state: { 
                    from: this.props.location,
                    error: error 
                }
            }}/>; 
        }
    }
}

export default OAuth2RedirectHandler;