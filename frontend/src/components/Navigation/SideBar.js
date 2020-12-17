import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.css";
import { Redirect } from "react-router-dom";

export class SideBar extends Component {
  render() {
    var redirectUrl = null;
    if (!localStorage.getItem("token")) {
      redirectUrl = <Redirect to="/login" />;
    }

    return (
      <div className="sidebar">
        {redirectUrl}
        <a className="brand-logo">
          {/*<img src="images/logo.png" alt="" />*/}
          <span>Direct Exchange </span>
        </a>
        <div className="menu">
          <ul>
            <li>
              <NavLink exact to="/" activeClassName="active">
                <span>
                  <i className="mdi mdi-view-dashboard" />
                </span>
                <span className="nav-text">Home</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/Rates" activeClassName="active">
                <span>
                  <i className="mdi mdi-repeat" />
                </span>
                <span className="nav-text">Prevailing Rates</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/getMyOffers" activeClassName="active">
                <span>
                  <i className="la la-money-check" />
                </span>
                <span className="nav-text">My Offers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/viewCounterOffers">
                <span>
                  <i className="mdi mdi-repeat" />
                </span>
                <span className="nav-text">Counter Offers</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/transact">
                <span>
                  <i className="mdi mdi-repeat" />
                </span>
                <span className="nav-text">Transact</span>
              </NavLink>
            </li>

            <li>
              <NavLink to="/report">
                <span>
                  <i className="mdi mdi-account" />
                </span>
                <span className="nav-text"> System Report</span>
              </NavLink>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <div className="copy_right">275 Project Group 5</div>
        </div>
      </div>
    );
  }
}

export default SideBar;
