import React, { Component } from 'react';
import '../../App.css';
import './Signup.css';
import axios from 'axios';
import LandingPage from "../Landing/LandingPage";
import { GOOGLE_AUTH_URL, FACEBOOK_AUTH_URL } from '../constants/index';
import fbLogo from '../img/fb-logo.png';
import googleLogo from '../img/google-logo.png';
import Header from "../Navigation/Header";
import { Link, Redirect } from 'react-router-dom'
import backend from '../../../src/helpers/serverDetails';

export class SignUp extends Component {
    constructor(props) {
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            emailID: "",
            password: "",
            nickname: "",
            submitted: false,
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
            emailId: this.state.emailID,
            password: this.state.password,
            nickname: this.state.nickname
        }
        console.log("sign up data: ", data);

        axios.defaults.withCredentials = true;
        axios.post(`${backend}/directexchange/auth/signup`, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successful registration: ", response.data);
                    this.setState({
                        successFlag: true,
                        msg: 'Successfully Registered!'
                    })
                }
            })
            .catch(error => {
                console.log("Error ******** :", error);
                this.setState({
                    successFlag: false,
                    errorFlag:true,
                    msg: error.response.data
                })
            });
    }

    render() {

        var message = null, redirectUrl=null;

        if(localStorage.getItem("token")) {
            redirectUrl = <Redirect to="/"></Redirect>
        }
        
        if (this.state.successFlag === true) {
            message = <div class="alert alert-success" role="alert">Successfully Registered, Please Verify Your Email!<a href={'/login'}> Verify here.</a></div>
        } else if (this.state.errorFlag === true) {
            message = <div class="alert alert-danger" role="alert">{this.state.msg}</div>
        }

        console.log("msg from java controller: ", this.state.msg);

        return (

            <div>
            {redirectUrl}
            <div className="container">
                <div className="content">

                    <h1 className="title">Signup with DirectExchange</h1>

                    <div className="social-signup">
                        <a className="btn btn-block social-btn google" href={GOOGLE_AUTH_URL}>
                            <img src={googleLogo} alt="Google" />
                            Sign up with Google
                        </a>
                        
                        <a className="btn btn-block social-btn facebook" href={FACEBOOK_AUTH_URL}>
                            <img src={fbLogo} alt="Facebook" />
                            Sign up with Facebook
                        </a>
                    </div>

                    <div className="or-separator"><div className="or-text">OR</div></div>

                    <form onSubmit={this.submitSignUp}>
                    
                        <div className="form-item">
                            <input onChange={this.changeHandler} type="email" className="form-control" name="emailID"
                                value={this.state.emailID} required placeholder="Username"/>
                        </div>

                        <div className="form-item">
                            <input onChange={this.changeHandler} type="text" className="form-control" name="nickname"
                                value={this.state.nickname} required placeholder="Nick name"/>
                        </div>

                        <div className="form-item">
                            <input onChange={this.changeHandler} type="password" className="form-control" name="password"
                                value={this.state.password} required placeholder="Password"/>
                        </div>
                        
                        <div className="form-item">
                            <button className="btn btn-block btn-primary" type="submit">
                                Sign Up 
                            </button>
                        </div>
                        {message}
                    </form>
                    <span className="login-link">Already have an account? <Link to="/login">Login!</Link></span>
                </div>
            </div>
            </div>
        )
    }
}
export default SignUp;