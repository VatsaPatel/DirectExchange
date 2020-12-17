import React, {Component} from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {Redirect} from "react-router";
import backend from '../../../../src/helpers/serverDetails';

export default class Home extends Component {

  constructor(props) {

    super(props);

    this.state = {
      offer: this.props.myOffer,
      submitted: false,
      allSingleMatches: null,
      single_count_offer_amount: 0,
      postCounterOfferFlag: false,
      postCounterMsg: "",
      transactionFlag: null,
      transactionMsg: "",
    }
    this.acceptSingleOfferHandler = this.acceptSingleOfferHandler.bind(this);
  }


  counterOfferAmountHandler = (e, offer) => {

    this.setState({
      single_count_offer_amount: e.target.value,
      postCounterMsg: ""
    })
  }


  acceptSingleOfferHandler(e, offer, offerType) {

    e.preventDefault();
    console.log("offer: accept offer: ", offer);

    axios.defaults.headers.common["authorization"] = "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    var data = "";
    if (offerType === "accept") {
      data = {
        source_offer: this.state.offer.offerId,
        offers_matched1: offer,
        source_offer_amount: this.state.offer.remitAmount,
        counterOfferId: -1
      }
      console.log("accept - final data: ", data);
    } else if (offerType === "accept-match") {
      data = {
        source_offer: this.state.offer.offerId,
        offers_matched1: offer,
        source_offer_amount: offer.finalAmount,
        counterOfferId: -1
      }
      console.log("accept-match - final data: ", data);
    }

    axios.post(`${backend}/directexchange/api/transactions/` + decodedToken.sub, data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log("Posted Counter Offers: ", response.data);
            this.setState({
              transactionFlag: true,
            })
          } else {
            this.setState({
              transactionFlag: false,
              transactionMsg: response.data
            })
          }
        })
        .catch(error => {
          console.log("Here we captured the error: ", error)
          this.setState({
            transactionFlag: false,
          })
        });
  }


  postSingleCounterHandler = (e, offer) => {
    e.preventDefault();

    console.log("postSingleCounterHandler: offer", offer);
    console.log("postSingleCounterHandler: receiver", e);
    console.log("postSingleCounterHandler: sender", this.state.offer);
    console.log("postSingleCounterHandler: offer amount", this.state.single_count_offer_amount);


    if (this.state.single_count_offer_amount >= (offer.remitAmount * 0.9) && this.state.single_count_offer_amount <= (offer.remitAmount * 1.1)) {

      var data = {
        senderOffer: this.state.offer,
        receiverOffer: offer,
        counter_offer_amount: this.state.single_count_offer_amount,
        type: 'single'
      }

      axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('token');
      var decodedToken = jwt_decode(localStorage.getItem('token'));
      console.log("decodedUserId: ", decodedToken.sub);

      axios.post(`${backend}/directexchange/user/counteroffer`, data)
          .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
              console.log("Fetched All Offers: ", response.data);
              this.setState({
                postCounterOfferFlag: true,
                postCounterMsg: response.data
              })
            }
          })
          .catch(error => {
            console.log("Here we captured the error: ", error)
            this.setState({
              postCounterOfferFlag: false,
              postCounterMsg: "Couldn't post offer, try after sometime."
            })
          });

    } else {
      this.setState({
        postCounterOfferFlag: false,
        postCounterMsg: "Counter offer not within valid range " + (offer.remitAmount * 0.9) + " - " + (offer.remitAmount * 1.1) + "!"
      })
    }
  }

  render() {
    console.log("inside all single matches:", this.props.allSingleMatches);

    var redirectVar = "";
    var errorMsg = "";
    var successMsg = "";

    if (this.state.transactionFlag) {
      redirectVar = <Redirect to={{pathname: "/transact"}}/>
       //successMsg = <div style={{color: "green"}}>Transaction initiated. Redirect to Transact page to complete it!</div>
    }

    if (this.state.transactionFlag === false) {
      errorMsg = <div style={{color: "red"}}>Transaction could not be completed. Please Try after sometime</div>
    }


    return (
        <div>
          {redirectVar}
          {(this.props.allSingleMatches && this.props.allSingleMatches.length !== 0) ?

              this.props.allSingleMatches.map(offer => (
                  <div>
                    <table className="table mb-0 table-responsive-sm view-offer-table" style={{color: "#5a656d"}}>
                      <thead>
                      <tr>
                        <th>
                          <div>USER NAME</div>
                        </th>
                        <th>
                          <div>AMOUNT</div>
                          <div>DIFFERENCE</div>
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
                          {offer.user.nickName}
                        </td>
                        {(parseInt(offer.remitAmount) - parseInt(this.props.myOffer.finalAmount)) >= 0 ?
                            <td className="text-success">+{(offer.remitAmount - this.props.myOffer.finalAmount)} {offer.srcCurrency}</td> :
                            <td className="text-danger">{(offer.remitAmount - this.props.myOffer.finalAmount)} {offer.srcCurrency}</td>}
                        <td>
                          {offer.srcCurrency} {offer.remitAmount}
                        </td>
                        <td>
                          {offer.destCurrency} {offer.finalAmount}
                        </td>
                        <td>
                          {offer.expDate.substring(0, 10)}
                        </td>
                        <td>
                          {offer.status}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div className="buy-sell-widget">
                      <ul className="nav nav-tabs">


                        {(parseInt(offer.remitAmount) - parseInt(this.props.myOffer.finalAmount) === 0) ?
                            <button className="counter-offer-button" data-toggle="modal" onClick={(e) => this.acceptSingleOfferHandler(e, offer, "accept")}> Accept </button>
                            :
                            <button className="counter-offer-button" data-toggle="modal" data-target={"#acceptOfferModalPopup" + offer.offerId}> Accept</button>}

                        {/*  directly accept offer modal - when ammount differs */}

                        <div className="modal fade" show="false" id={"acceptOfferModalPopup" + offer.offerId} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{width: "1000px", background: "#eff2f7"}}>

                              <div className="modal-body" style={{padding: "0px"}}>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{padding: "10px"}} onClick={this.props.handleRefresh.bind(this)}>
                                  <span aria-hidden="true">&times;</span>
                                </button>
                                {/*<form>*/}
                                <div className="counter-offer-details">
                                  <br/>
                                  <h4 className="main-title">Accept Offer Details</h4>

                                  <div className="form-group">
                                    <br/>
                                    <div>Please note: There is a difference between your initial offer and the amount to be sent.
                                      <br/>
                                      <br/>
                                      <div> Accept below to match the offer or Post a counter offer</div>
                                    </div>
                                    <br/>
                                    <br/>

                                    <button type="submit" className="post-counter-offer-custom-button" onClick={(e) => this.acceptSingleOfferHandler(e, offer, "accept-match")}>ACCEPT OFFER</button>
                                    <br/><br/>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                        {(offer.counterOfferFlag.toString() === "true" ?
                            <div>
                              <button className="counter-offer-button" data-toggle="modal" data-target={"#newOfferModalPopup" + offer.offerId}> Counter</button>
                              <div className="modal fade" id="newOfferModalPopup" id={"newOfferModalPopup" + offer.offerId} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                                <div className="modal-dialog modal-dialog-centered" role="document">
                                  <div className="modal-content" style={{width: "1000px", background: "#eff2f7"}}>
                                    <div className="modal-body" style={{padding: "0px"}}>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{padding: "10px"}}  onClick={this.props.handleRefresh.bind(this)}>
                                        <span aria-hidden="true">&times;</span>
                                      </button>
                                      {/*<form>*/}
                                      <div className="counter-offer-details">
                                        <br/>
                                        <h4 className="main-title">Counter Offer Details</h4>

                                        <div className="form-group">
                                          <br/>
                                          <div>Please enter your counter offer below
                                          </div>
                                          <br/>
                                          <div>Note: The counter offer must be within the range of 90% to 110% of source remit amount
                                          </div>
                                          <br/>
                                          <div> eg: {(parseInt(offer.remitAmount) * 0.9).toFixed(2)} to {(parseInt(offer.remitAmount) * 1.1).toFixed(2)}
                                          </div>
                                          <br/>
                                          <input type="number" className="form-control" placeholder="Counter Offer Amount" name="amount" onChange={(e) => this.counterOfferAmountHandler(e, offer)} required/>

                                          <button type="submit" className="post-counter-offer-custom-button" onClick={(e) => this.postSingleCounterHandler(e, offer)}> POST COUNTER OFFER</button>

                                          <br/><br/>
                                          {this.state.postCounterOfferFlag ?
                                              <div style={{color: "green"}}>{this.state.postCounterMsg}</div> :
                                              <div style={{color: "red"}}>{this.state.postCounterMsg}</div>}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            : "")}
                      </ul>
                    </div>

                  </div>
              )) : <div> No matches yet!</div>}
          {errorMsg}
        </div>

    )
  }
}