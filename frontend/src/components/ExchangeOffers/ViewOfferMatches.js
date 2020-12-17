import React, {Component} from 'react';
import '../../styles/css/style.css';
import axios from 'axios';
import Header from "../Navigation/Header";
import SideBar from "../Navigation/SideBar";
import Collapsible from 'react-collapsible';
import jwt_decode from "jwt-decode";
import {Redirect} from "react-router";
import ViewSingleMatches from "../Screens/ViewSingleMatches/ViewSingleMatches";
import ViewSplitMatches from "../Screens/ViewSplitMatches/ViewSplitMatches";
import ViewOtherSplitMatches from "../Screens/ViewOtherSplitMatches/ViewOtherSplitMatches";
import PostOffer from "./PostOffer";
import backend from '../../../src/helpers/serverDetails';

export class ViewOfferMatches extends Component {
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {
      offer: this.props.location.state.offer,
      submitted: false,
      allSingleMatches: null,
      allSplitMatches: null,
      otherSplitMatches: null,
      counter_error: null,
      postCounterOfferFlag: false,
      postCounterMsg: "",
      transactionFlag: null,
      transactionMsg: "",
      split_counter_offer_receiver: ""
    }
  }

  componentDidMount() {
    this.getSingleMatches(this.state.offer);
  }

  getSingleMatches = (e) => {
    console.log("Inside get single matches: ", e);

    let userId = e.user.userId;
    let remitAmount = e.finalAmount;
    let srcCurrency = e.destCurrency;
    let destCurrency = e.srcCurrency;

    axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('token');
    var decodedToken = jwt_decode(localStorage.getItem('token'));
    console.log("decodedUserId: ", decodedToken.sub);

    axios.get(`${backend}/directexchange/user/allmatches/` + userId + "/" + remitAmount + "/" + srcCurrency + "/" + destCurrency)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log("Posted Counter Offers: ", response.data);
            this.setState({
              successFlag: true,
              allSingleMatches: response.data.singleMatches,
              allSplitMatches: response.data.splitMatches,
              otherSplitMatches: response.data.otherSplitMatches
            })
          }
        }).catch(error => {
      console.log("Here we captured the error: ", error)
      this.setState({
        successFlag: false,
        allSingleMatches: null,
        allSplitMatches: null,
        otherSplitMatches: null
      })
    });
  }

  handleRefresh = () => {
    window.location.reload();
  };

  render() {

    // console.log("state data view all offers: ", this.state);
    var redirectVar = "";
    var errorMsg = "";
    if (this.state.transactionFlag) {
      redirectVar = <Redirect to={{pathname: "/transact"}}/>
    }

    if (this.state.transactionFlag == false) {
      errorMsg = <div style={{color: "red"}}>Transaction could not be completed. Please Try after sometime</div>
    }


    return (
        <div>
          {redirectVar}
          <Header/>
          <SideBar/>
          <div className="content-body">
            <div className="myContainer">
              <div className="col-xl-12">
                <div className="card" style={{width: "fit-content"}}>

                  <div className="card-header">
                    <h5 className="card-title" style={{fontSize: "28px"}}>My Original Offer</h5>
                  </div>
                  <div className="card-body pt-0">
                    <div className="transaction-table">
                      <div className="table-responsive">
                        <table
                            className="table mb-0 table-responsive-sm view-offer-table"
                            style={{color: "#5a656d"}}>
                          <thead>
                          <tr>
                            <th>
                              <div>USER</div>
                              <div>NAME</div>
                            </th>
                            <th>
                              <div>SOURCE</div>
                              <div>OFFER</div>
                            </th>
                            <th>
                              <div>AMOUNT</div>
                              <div>TO SEND</div>
                            </th>
                            <th>
                              <div>EXPIRATION</div>
                              <div>DATE</div>
                            </th>
                            <th>
                              <div>OFFER</div>
                              <div>STATUS</div>
                            </th>
                          </tr>
                          </thead>
                          <tbody>
                          <tr>
                            <td>
                              {this.state.offer.user.nickName}
                            </td>
                            <td>
                              {this.state.offer.srcCurrency} {this.state.offer.remitAmount}
                            </td>
                            <td>
                              {this.state.offer.destCurrency} {this.state.offer.finalAmount}
                            </td>
                            <td>
                              {this.state.offer.expDate.substring(0, 10)}
                            </td>
                            <td>
                              {this.state.offer.status}
                            </td>
                          </tr>
                          </tbody>
                        </table>
                        <br/>
                        {errorMsg}
                      </div>
                    </div>
                  </div>
                  <div className="card-header">
                    <h4 className="card-title" style={{fontSize: "28px"}}>View All Matching Offers</h4>
                  </div>

                  <Collapsible trigger="View Single Matches" triggerClassName="view-collapsible-tab view-single-match-collapsible-tab" triggerOpenedClassName="view-collapsible-tab view-single-match-collapsible-tab">

                    <div className="card-body pt-0">
                      <div className="transaction-table">
                        <div className="table-responsive">

                          <ViewSingleMatches allSingleMatches={this.state.allSingleMatches} myOffer={this.state.offer} handleRefresh={this.handleRefresh} />

                        </div>
                      </div>
                    </div>

                  </Collapsible>

                  {this.state.offer.splitOfferFlag ?

                      <Collapsible trigger="View Split Matches"
                                   triggerClassName="view-collapsible-tab view-split-match-collapsible-tab"
                                   triggerOpenedClassName="view-collapsible-tab view-split-match-collapsible-tab">


                        <div className="card-body pt-0">
                          <div className="transaction-table">
                            <div className="table-responsive">

                              <ViewSplitMatches allSplitMatches={this.state.allSplitMatches} myOffer={this.state.offer} handleRefresh={this.handleRefresh} />
                            </div>
                          </div>
                        </div>
                      </Collapsible> : ""}
                  <Collapsible trigger="View Matches in Others Split Offers"
                               triggerClassName="view-collapsible-tab view-other-split-match-collapsible-tab"
                               triggerOpenedClassName="view-collapsible-tab view-other-split-match-collapsible-tab">


                    <div className="card-body pt-0">
                      <div className="transaction-table">
                        <div className="table-responsive">

                          <ViewOtherSplitMatches otherSplitMatches={this.state.otherSplitMatches} myOffer={this.state.offer} handleRefresh={this.handleRefresh} />
                        </div>
                      </div>
                    </div>
                  </Collapsible>
                </div>
              </div>
            </div>
          </div>
        </div>
    )
  }
}

export default ViewOfferMatches;