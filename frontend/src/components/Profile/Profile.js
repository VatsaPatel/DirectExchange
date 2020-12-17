import React, { Component } from 'react';
import '../../App.css';
import '../Signup/Signup.css';
import axios from 'axios';
import Header from "../Navigation/Header";
import { Redirect } from 'react-router-dom'
import jwt_decode from "jwt-decode";
import SideBar from '../Navigation/SideBar';
import backend from '../../../src/helpers/serverDetails';

export class Profile extends Component {
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

    componentDidMount() {
        var redirecturl = null;
        if(localStorage.getItem('token')) {
        axios.defaults.headers.common['authorization']= 'Bearer ' + localStorage.getItem('token');
        var decodedToken = jwt_decode(localStorage.getItem('token'));
        console.log("decodedUserId: ", decodedToken.sub);

        axios.get(`${backend}/directexchange/profile/`+decodedToken.sub)
        .then((response) => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
            console.log("Fetched User: ", response.data);
            this.setState({
                emailId: response.data.emailId,
                nickName: response.data.nickName,
            });
            }
        })
        .catch((error) => {
            console.log("Here we captured the error: ", error);
            this.setState({
                successFlag: false,
                user: null,
            });
        });
    }
    else {
        redirecturl = <Redirect to="/login"/>;
    }
    }

    changeHandler(e) {
        this.setState({
            [e.target.name] : e.target.value
        })        
    }

    submitProfileUpdate = (e) => {
        e.preventDefault();
        const data = {
            nickName: this.state.nickName,
        }
        console.log("Update Profile: ", data);

        axios.defaults.withCredentials = true;
        var decodedToken = jwt_decode(localStorage.getItem('token'));
        axios.put(`${backend}/directexchange/profile/` + decodedToken.sub, data)
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    console.log("Successfully Updated User Profile: ", response.data);
                    this.setState({
                        successFlag: true,
                    })
                    localStorage.setItem("nickName", this.state.nickName )
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

        var message = null, redirectUrl = null;

        if (this.state.successFlag === true) {
            message = <div class="alert alert-success" role="alert">Profile Successfully Updated!</div>
        } else if (this.state.errorFlag === true) {
            message = <div class="alert alert-danger" role="alert">{this.state.msg}</div>
        }
        if(!localStorage.getItem('token')) {
            redirectUrl = <Redirect to="/login"/>;
        }

        console.log("msg from java controller: ", this.state.msg);

        return (

            <div>
            {redirectUrl}
            <Header/>
            <SideBar/>
            <div className="content-body col-md-20">
            <div className="container">
                <div className="content">

                    <h1 className="title">User Profile</h1>

                    <form onSubmit={this.submitProfileUpdate}>                        
                        <div className="form-row">
                            <label className="label">Email:</label> 
                            <input disabled type="username" className="form-control" name="username"
                                value={this.state.emailId} required placeholder={this.state.emailId}/>
                        </div>
                        <br/>
                        <div className="form-row">
                        <label className="label">Nickname:</label> 
                            <input onChange={this.changeHandler} type="nickName" className="form-control" name="nickName"
                                value={this.state.nickName} required pattern="[A-Za-z0-9]+" title="Please enter only aplha numeric values" placeholder={this.state.nickName}/>
                        </div>

                        <br/>
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
            </div>
        )
    }
}
export default Profile;