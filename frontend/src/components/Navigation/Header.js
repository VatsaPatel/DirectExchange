import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import "./Navigation.css";
import jwt_decode from "jwt-decode";

export class Header extends Component {
  componentDidMount() {
    if (localStorage.getItem("token") === null) {
      this.setState({
        logout: true,
      });
    }
  }

  onLogoutClick = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nickName");
    this.setState({
      logout: true,
    });
    console.log("In logout ", localStorage.getItem("token"));
  };

  render() {
    var redirectUrl = null;
    if (this.state && this.state.logout) {
      redirectUrl = <Redirect to="/login" />;
    }

    if (!localStorage.getItem("token")) {
      redirectUrl = <Redirect to="/login" />;
    }
    return (
      <div className="header">
        {redirectUrl}
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <nav className="navbar">
                <div className="header-search">
                  <form action="#">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text" id="basic-addon2">
                          <i className="fa fa-search" />
                        </span>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="dashboard_log my-2">
                  <div className="d-flex align-items-center">
                    <div className="profile_log dropdown">
                      <div className="user" data-toggle="dropdown">
                        <span className="thumb">
                          <i className="mdi mdi-account" />
                        </span>
                        <span className="name">{localStorage.getItem("nickName") == null 
                                                ? 'Hi User!' : 'Hi ' + localStorage.getItem("nickName") + '!'
                                              }</span>
                        <span className="arrow">
                          <i className="la la-angle-down" />
                        </span>
                      </div>
                      <div className="dropdown-menu dropdown-menu-right">
                        <a href="/profile" className="dropdown-item">
                          <i className="mdi mdi-account" /> Profile
                        </a>
                        <a href="/account" className="dropdown-item">
                          <i className="mdi mdi-bank" /> Account
                        </a>
                        {/*<a href="history.html" className="dropdown-item">
                          <i className="la la-book" /> History
                          </a>*/}
                        <Link
                          onClick={this.onLogoutClick}
                          to="/login"
                          className="dropdown-item logout"
                        >
                          <i className="la la-sign-out" /> Logout
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
