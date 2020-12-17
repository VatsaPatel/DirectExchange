import React, { Component } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import { history } from "../helpers/history";
import ProtectedRoute from "./ProtectedRoute";
import SignUp from "./Signup/SignUp";
import Login from "./Login/Login";
import GetMyOffers from "./ExchangeOffers/GetMyOffers";
import ViewOfferMatches from "./ExchangeOffers/ViewOfferMatches";
import Transact from "./Transact/Transact";
import PrevailingRates from "./Rates/PrevailingRates";
import viewAllOffers from "./Screens/ViewAllOffers/viewAllOffers";
import ViewOffer from "./Screens/ViewOffer/ViewOffer.js";
import OAuth2RedirectHandler from "./Login/OAuth2RedirectHandler";
import Verify from "./Verify/Verify";
import Profile from "./Profile/Profile";
import BankAccount from "./BankAccount/BankAccount";
import AddBankAccount from "./BankAccount/AddBankAccount";
import ViewCounterOffers from "./ExchangeOffers/ViewCounterOffers";
import ViewCounterOffer from "./Screens/ViewCounterOffer/ViewCounterOffer";
import TransactHistory from "./ExchangeOffers/TransactHistory";
import Report from "./Report/Report";

//Create a Main Component
class Main extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <ProtectedRoute exact path="/" component={viewAllOffers} />
          <ProtectedRoute exact path="/ViewOffer" component={ViewOffer} />
          <ProtectedRoute
            exact
            path="/ViewCounterOffer"
            component={ViewCounterOffer}
          />
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/login" component={Login} />
          <ProtectedRoute exact path="/getMyOffers" component={GetMyOffers} />
          <Route
            exact
            path="/oauth2/redirect"
            component={OAuth2RedirectHandler}
          ></Route>
          <ProtectedRoute
            exact
            path="/viewOfferMatches"
            component={ViewOfferMatches}
          />
          <ProtectedRoute path="/transact" component={Transact} />
          <ProtectedRoute path="/rates" component={PrevailingRates} />
          <Route path="/verify" component={Verify} />
          <ProtectedRoute path="/profile" component={Profile} />
          <ProtectedRoute path="/account" component={BankAccount} />
          <ProtectedRoute path="/addAccount" component={AddBankAccount} />
          <ProtectedRoute
            path="/viewCounterOffers"
            component={ViewCounterOffers}
          />
          <ProtectedRoute path="/transactHistory" component={TransactHistory} />
          <ProtectedRoute path="/report" component={Report} />
          <Redirect to="/" />
        </Switch>
      </Router>
    );
  }
}

export default Main;
