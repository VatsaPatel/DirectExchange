import React, {Component} from "react";
import {Link} from "react-router-dom";
import StarRatings from 'react-star-ratings';
import axios from "axios";
import jwt_decode from "jwt-decode";
import TransactHistory from "../../ExchangeOffers/TransactHistory";
import backend from '../../../../src/helpers/serverDetails';
import './view-offer.css';

export default class Home extends Component {

  constructor() {
    super();
    this.state = {
      historyFlag: false,
      historyDetails: null
    }
    this.transactionHistoryHandler = this.transactionHistoryHandler.bind(this);
  }

  transactionHistoryHandler(offer, e) {
    console.log("offer details: ", offer.user.userId);
    e.preventDefault();
    axios.defaults.headers.common["authorization"] = "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    axios.get(`${backend}/directexchange/api/transactions/history/` + offer.user.userId)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log("Posted Counter Offers: ", response.data);
            this.setState({
              historyFlag: true,
              historyDetails: response.data
            })
          } else {
            this.setState({
              historyFlag: false,
            })
          }
        })
        .catch(error => {
          console.log("Here we captured the error: ", error)
          this.setState({
            historyFlag: false,
          })
        });
  }

  render() {
    console.log("all history details: ", this.state.historyDetails, "  flag: ", this.state.historyFlag);
    return (
        <div
            className="col-md-6"
            style={{display: "flex", justifyContent: "center"}}
        >
          <div className="offerContainer">
          <span>
            Posted By: <span className="postedBy">{this.props.postedBy}</span> &emsp;
            {this.props.offerObj.user.rating > 0 ?
                <span className="transaction-trigger" onClick={(e) => this.transactionHistoryHandler(this.props.offerObj, e)} data-toggle="modal" data-target="#transactionHistoryModalPopup">
                <span className="postedBy"><span style={{color: "#8691b4"}}>Rating: </span>{this.props.offerObj.user.rating}&nbsp;
                  <span><StarRatings rating={1} starRatedColor="red" starDimension='17px'  numberOfStars={1} name='rating'/></span>
                </span>

         </span>
                : ""}

          </span>
            <div
                style={{display: "flex", flexDirection: "row", margin: "10px 0"}}
            >
              <div className="offerDetails">
                <span className="offerDetailTop">From:</span>
                <span className="offerCountry">{this.props.srcCountry}</span>
                <div>
                  <span className="offerCurrency">{this.props.srcCurrency}{' '}</span>
                  <span className="offerAmount">{this.props.remitAmount}</span>
                </div>
              </div>

              <span className="arrowContainer">
              <i className="arrowC la la-arrow-right"/>
            </span>

              <div className="offerDetails">
                <span className="offerDetailTop">To:</span>
                <span className="offerCountry">{this.props.destCountry}</span>
                <div>
                  <span className="offerCurrency">{this.props.destCurrency}{' '}</span>
                  <span className="offerAmount">{this.props.finalAmount}</span>
                </div>
              </div>
            </div>

            <Link
                to={{pathname: '/ViewOffer', state: {offerObj: this.props.offerObj}}}
                className="customBtn"
            >View Offer</Link>
          </div>


          {(this.state.historyFlag && this.state.historyDetails && this.state.historyDetails.transactionHistory && this.state.historyDetails.transactionHistory.length != 0) ?

              <div className="modal fade" id="transactionHistoryModalPopup" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">

                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content" style={{background: "#eff2f7", width:"fit-content"}}>

                    <div className="modal-body" style={{padding: "0px"}}>

                            <TransactHistory history={this.state.historyDetails.transactionHistory}/>

                    </div>
                  </div>
                </div>
              </div> : ""}
        </div>
    );
  }
}
