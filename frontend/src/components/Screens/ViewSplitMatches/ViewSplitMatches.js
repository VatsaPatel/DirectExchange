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
      split_count_offer_amount: 0,
      postCounterOfferFlag: false,
      postCounterMsg: "",
      transactionFlag: null,
      transactionMsg: "",
    }
    this.acceptSplitOfferHandler = this.acceptSplitOfferHandler.bind(this);
    this.postSplitCounterHandler = this.postSplitCounterHandler.bind(this);
    this.splitCounterOfferAmountHandler = this.splitCounterOfferAmountHandler.bind(this);
  }

  splitCounterOfferAmountHandler = (e) => {

    this.setState({
      split_count_offer_amount: e.target.value,
      postCounterMsg: ""
    })
  }


  acceptSplitOfferHandler(e, offer1, offer2, offerType) {
    e.preventDefault();

    console.log("offer type: ", offerType);

    axios.defaults.headers.common["authorization"] =
        "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));
    var data = "";

    if (offerType === "accept") {
      data = {
        source_offer: this.state.offer.offerId,
        offers_matched1: offer1,
        offers_matched2: offer2,
        source_offer_amount: this.state.offer.remitAmount,
        counterOfferId: -1
      }
    } else if (offerType === "accept-match") {

      var final_source_offer_ammount = 0;

      if (this.state.offer.remitAmount - (offer1.finalAmount + offer2.finalAmount) > 0) {
        // console.log("inside if");
        console.log("if offer1.finalAmount: ", offer1.finalAmount);
        console.log("if offer2.finalAmount: ", offer2.finalAmount);
        console.log("if this.state.offer.remitAmount: ", this.state.offer.remitAmount);
        final_source_offer_ammount = this.state.offer.remitAmount - (this.state.offer.remitAmount - (offer1.finalAmount + offer2.finalAmount))
      } else {
        console.log("else offer1.finalAmount: ", offer1.finalAmount);
        console.log("else offer2.finalAmount: ", offer2.finalAmount);
        console.log("else this.state.offer.remitAmount: ", this.state.offer.remitAmount);
        // console.log("inside else: ", this.state.offer.remitAmount , "---", ((offer1.finalAmount + offer2.finalAmount) - this.state.offer.remitAmount));
        final_source_offer_ammount = this.state.offer.remitAmount + ((offer1.finalAmount + offer2.finalAmount) - this.state.offer.remitAmount)
      }

      console.log("after calculations; ", final_source_offer_ammount);

      data = {
        source_offer: this.state.offer.offerId,
        offers_matched1: offer1,
        offers_matched2: offer2,
        source_offer_amount: final_source_offer_ammount,
        counterOfferId: -1
      }
    }


    console.log("data for transaction: ", data, "--- offer initial amount: ", this.state.offer.remitAmount);

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
              transactionMsg: "Couldn't complete transaction. Try after sometime"
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


  postSplitCounterHandler = (e, offer1, offer2, offer) => {
    e.preventDefault();
    console.log("both: ", offer);

    console.log("postSplitCounterHandler offer1.finalAmount", offer1.finalAmount);
    console.log("postSplitCounterHandler offer2.finalAmount", offer2.finalAmount);
    var isAdd = false;
    var counter_amount = 0;
    var counter_offer_receiver_name = "";
    var data = "";
    var isTransaction = false;

    if (offer1.remitAmount >= offer2.remitAmount) {
      console.log("offer1 to transaction split: ");

      if (this.state.split_count_offer_amount >= (offer1.remitAmount * 0.9) && this.state.split_count_offer_amount <= (offer1.remitAmount * 1.1)) {

        counter_offer_receiver_name = offer1.user.nickName

        console.log("counter_offer_receiver_name 1: ", counter_offer_receiver_name, "amount ---", counter_amount);

        data = {
          senderOffer: this.state.offer,
          receiverOffer: offer1,
          thirdParty: offer2,
          counter_offer_amount: this.state.split_count_offer_amount,
          type: 'split'
        }
        isTransaction = true;

      } else {

        this.setState({
          postCounterOfferFlag: false,
          postCounterMsg: "Counter offer not " + offer1.user.nickName + " within valid range " + (offer1.remitAmount * 0.9) + " - " + (offer1.remitAmount * 1.1) + "!"
        })

      }

    } else {

      console.log("offer2 to transaction split: ");
      if (this.state.split_count_offer_amount >= (offer2.remitAmount * 0.9) && this.state.split_count_offer_amount <= (offer2.remitAmount * 1.1)) {

        counter_offer_receiver_name = offer2.user.nickName
        console.log("counter_offer_receiver_name 2: ", counter_offer_receiver_name, "amount ---", counter_amount);

        data = {
          senderOffer: this.state.offer,
          receiverOffer: offer2,
          thirdParty: offer1,
          counter_offer_amount: this.state.split_count_offer_amount,
          type: 'split'
        }
        isTransaction = true;
      } else {

        this.setState({
          postCounterOfferFlag: false,
          // split_count_offer_amount:0,
          postCounterMsg: "Counter offer to " + offer2.user.nickName + " not within valid range " + (offer2.remitAmount * 0.9) + " - " + (offer2.remitAmount * 1.1) + "!"
        })
      }
    }

    console.log("data for transaction split: ", data);

    if (isTransaction) {
      axios.defaults.headers.common['authorization'] = 'Bearer ' + localStorage.getItem('token');
      var decodedToken = jwt_decode(localStorage.getItem('token'));
      console.log("decodedUserId: ", decodedToken.sub);

      axios.post(`${backend}/directexchange/user/counteroffer/split`, data)
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
    }
  }

  render() {
    console.log("inside all split matches:", this.props.allSplitMatches);

    var redirectVar = "";
    var errorMsg = "";
    if (this.state.transactionFlag) {
      redirectVar = <Redirect to={{pathname: "/transact"}}/>
    }

    if (this.state.transactionFlag === false) {
      errorMsg = <div style={{color: "red"}}>Transaction could not be completed. Please Try after sometime</div>
    }


    return (
        <div>
          {redirectVar}
          {(this.props.allSplitMatches && this.props.allSplitMatches.length !== 0) ?

              this.props.allSplitMatches.map(offer => (
                  <div>
                    <table className="table mb-0 table-responsive-sm view-offer-table" style={{color: "#5a656d"}}>
                      <thead>
                      <tr>
                        <th>
                          <div>USER NAME</div>
                        </th>
                        <th>
                          <div>TOTAL</div>
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
                          {offer[0].user.nickName}
                        </td>

                        {(offer[0].remitAmount >= offer[1].remitAmount) ?

                            //
                            // (parseInt(offer[1].remitAmount + this.state.offer.finalAmount) < parseInt(offer[0].remitAmount)) ?
                            //
                            //     <td className="text-danger">{((offer[1].remitAmount + this.state.offer.finalAmount) - offer[0].remitAmount)} {offer[0].srcCurrency}</td> :
                            //
                            //     (parseInt(offer[1].remitAmount + this.state.offer.finalAmount) <= parseInt(offer[0].remitAmount) * 1.1) ?
                            //
                            //         <td className="text-success">+{((offer[1].remitAmount + this.state.offer.finalAmount) - offer[0].remitAmount)} {offer[0].srcCurrency}</td> :

                                    (parseInt(offer[0].remitAmount + offer[1].remitAmount) - parseInt(this.state.offer.finalAmount)) >= 0 ?

                                        <td className="text-success">+{((offer[0].remitAmount + offer[1].remitAmount) - this.state.offer.finalAmount)} {offer[0].srcCurrency}</td> :
                                        <td className="text-danger">{((offer[0].remitAmount + offer[1].remitAmount) - this.state.offer.finalAmount)} {offer[0].srcCurrency}</td>

                            : <td>
                              <div style={{color: "#f6f8fe"}}> None</div>
                            </td>
                        }

                        <td>
                          {offer[0].srcCurrency} {offer[0].remitAmount}
                        </td>

                        <td>
                          {offer[0].destCurrency} {offer[0].finalAmount}
                        </td>

                        <td>
                          {offer[0].expDate.substring(0, 10)}
                        </td>
                        <td>
                          {offer[0].status}
                        </td>
                      </tr>

                      <tr>
                        <td>
                          {offer[1].user.nickName}
                        </td>

                        {(offer[1].remitAmount > offer[0].remitAmount) ?

                            // (parseInt(offer[0].remitAmount + this.state.offer.finalAmount) < parseInt(offer[1].remitAmount)) ?
                            //
                            //     <td className="text-danger">{((offer[0].remitAmount + this.state.offer.finalAmount) - offer[1].remitAmount)} {offer[1].srcCurrency}</td> :
                            //
                            //     (parseInt(offer[0].remitAmount + this.state.offer.finalAmount) <= parseInt(offer[1].remitAmount) * 1.1) ?
                            //
                            //         <td className="text-success">+{((offer[0].remitAmount + this.state.offer.finalAmount) - offer[1].remitAmount)} {offer[1].srcCurrency}</td> :


                                    (parseInt(offer[0].remitAmount + offer[1].remitAmount) - parseInt(this.state.offer.finalAmount)) >= 0 ?
                                        <td className="text-success">+{((offer[0].remitAmount + offer[1].remitAmount) - this.state.offer.finalAmount)} {offer[0].srcCurrency}</td> :
                                        <td className="text-danger">{((offer[0].remitAmount + offer[1].remitAmount) - this.state.offer.finalAmount)} {offer[0].srcCurrency}</td>
                            : <td>
                              <div style={{color: "#f6f8fe"}}> None</div>
                            </td>
                        }

                        <td>
                          {offer[1].srcCurrency} {offer[1].remitAmount}
                        </td>
                        <td>
                          {offer[1].destCurrency} {offer[1].finalAmount}
                        </td>

                        <td>
                          {offer[1].expDate.substring(0, 10)}
                        </td>
                        <td>
                          {offer[1].status}
                        </td>
                      </tr>
                      </tbody>
                    </table>
                    <div className="buy-sell-widget">
                      <ul className="nav nav-tabs">

                        {((((parseInt(offer[0].remitAmount + offer[1].remitAmount) - parseInt(this.state.offer.finalAmount)) == 0) || ((parseInt(offer[0].remitAmount + this.state.offer.finalAmount) - parseInt(offer[1].remitAmount)) == 0) || ((parseInt(offer[1].remitAmount + this.state.offer.finalAmount) - parseInt(offer[0].remitAmount)) == 0))) ?
                            <button className="counter-offer-button" data-toggle="modal" onClick={(e) => this.acceptSplitOfferHandler(e, offer[0], offer[1], "accept")}> Accept </button>
                            :
                            <button className="counter-offer-button" data-toggle="modal" data-target={"#acceptSplitOfferModalPopup" + offer[0].offerId + "--" + offer[1].offerId}> Accept </button>}

                        <div className="modal fade" id={"acceptSplitOfferModalPopup" + offer[0].offerId + "--" + offer[1].offerId} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                          <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{width: "1000px", background: "#eff2f7"}}>
                              <div className="modal-body" style={{padding: "0px"}}>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{padding: "10px"}}>
                                  <span aria-hidden="true">&times;</span>
                                </button>

                                <div className="counter-offer-details">
                                  <br/>
                                  <h4 className="main-title">Accept Offer Details </h4>
                                  <div className="form-group">
                                    <br/>
                                    <div>Please note: There is a difference between your initial offer and the amount to be sent.
                                      <br/>
                                      <br/>
                                      <div> Accept below to match the offer or Post a counter offer
                                      </div>
                                    </div>
                                    <br/>
                                    <br/>
                                    <button type="submit" className="post-counter-offer-custom-button" onClick={(e) => this.acceptSplitOfferHandler(e, offer[0], offer[1], "accept-match")}> ACCEPT OFFER</button>

                                    <br/><br/>

                                    <div style={{color: "red"}}>{this.state.counter_error}</div>
                                    {this.state.postCounterOfferFlag ?
                                        <div style={{color: "green"}}>{this.state.postCounterMsg}</div> :
                                        <div style={{color: "red"}}>{this.state.postCounterMsg}</div>}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>


                        {(offer[0].counterOfferFlag.toString() === "true" || offer[1].counterOfferFlag.toString() === "true") ?
                            <div>
                              <button className="counter-offer-button" data-toggle="modal" data-target={"#newSplitOfferModalPopup" + offer[0].offerId + "--" + offer[1].offerId}> Counter</button>

                              <div className="modal fade" id={"newSplitOfferModalPopup" + offer[0].offerId + "--" + offer[1].offerId} role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                                <div className="modal-dialog modal-dialog-centered" role="document">
                                  <div className="modal-content" style={{width: "1000px", background: "#eff2f7"}}>

                                    <div className="modal-body" style={{padding: "0px"}}>
                                      <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{padding: "10px"}}>
                                        <span aria-hidden="true">&times;</span>
                                      </button>

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
                                          <input type="number" className="form-control" placeholder="Counter Offer Amount" name="amount" onChange={this.splitCounterOfferAmountHandler} required/>

                                          <button type="submit" className="post-counter-offer-custom-button" onClick={(e) => this.postSplitCounterHandler(e, offer[0], offer[1], offer)}> POST COUNTER OFFER</button>

                                          <br/> <br/> <br/>
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
                            : ""}
                      </ul>
                    </div>
                  </div>
              )) : <div> No matches yet!</div>}
        </div>
    )
  }
}