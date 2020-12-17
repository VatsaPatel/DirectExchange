import React, { Component } from 'react';
import '../../App.css';
import '../Signup/Signup.css';
import axios from 'axios';
import LandingPage from "../Landing/LandingPage";
import fbLogo from '../img/fb-logo.png';
import googleLogo from '../img/google-logo.png';
import Header from "../Navigation/Header";
import { Link, Redirect } from 'react-router-dom'
import backend from '../../../src/helpers/serverDetails';

export class Verify extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            code:'',
            successFlag: false,
            errorFlag: false
        }
        this.changeHandler = this.changeHandler.bind(this);
    }

    changeHandler(e) {
        this.setState({
            [e.target.name] : e.target.value
        })        
    }

    submitSignUp = (e) => {
        e.preventDefault();
        const data = {
            code: this.state.code,
        }
        console.log("sign up data: ", data);

        axios.defaults.withCredentials = true;
        axios.post(`${backend}/directexchange/auth/verify`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successfully Verified: ", response.data);
                    this.setState({
                        successFlag: true,
                    })
                }
            })
            .catch(error => {
                console.log("Error ******** :", error);
                this.setState({
                    code: null,
                    successFlag: false,
                    errorFlag:true,
                    msg: error.response.data
                })
            });
    }

    render() {

        var message = null, redirectUrl=null;

        if(localStorage.getItem("token")) {
            redirectUrl = <Redirect to={{pathname: "/login"}}></Redirect>
        }
        
        if (this.state.successFlag === true) {
            redirectUrl = <Redirect to={{pathname: "/login", state: {"from":"verified", "msg": "Successfully Verified Code"}}}></Redirect>
            message = <div class="alert alert-success" role="alert">Successfully Registered, Please Verify Your Email!<a href={'/verify'}> Verify here.</a></div>
        } else if (this.state.errorFlag === true) {
            message = <div class="alert alert-danger" role="alert">{this.state.msg}</div>
        }

        console.log("msg from java controller: ", this.state.msg);

        return (

            <div>
            {redirectUrl}
            <div className="container">
                <div className="content">

                    <h1 className="title">Enter code for verification with DirectExchange</h1>

                    <form onSubmit={this.submitSignUp} >
                        <div className="form-item">
                            <input onChange={this.changeHandler} type="code" className="form-control" name="code"
                                value={this.state.code} required placeholder="Verification Code"/>
                        </div>

                        <div className="form-item">
                            <button className="btn btn-block btn-primary" type="submit">
                                Submit 
                            </button>
                        </div>
                        {message}
                    </form>
                </div>
            </div>
            </div>
        )
    }
}
export default Verify;