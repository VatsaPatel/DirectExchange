import React, { Component } from "react";
import { Link } from "react-router-dom";
export default class Home extends Component {
  render() {
    return (
        <div
            className="col-md-6"
            style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="offerContainer">
          <span>
            Posted By: <span className="postedBy">{this.props.senderNickName}</span><br/>
            Counter Offer Amount: <span className="postedBy">{this.props.counterOfferAmount}</span><br/>
            Status: <span className="postedBy">{this.props.status}</span><br/>
          </span>
            <div
                style={{ display: "flex", flexDirection: "row", margin: "10px 0" }}
            >
              <div className="offerDetails">
                <span className="offerDetailTop">Your Initial Offer:</span>
                <span className="offerCountry">{this.props.receiverOffer.srcCountry}</span>
                <div>
                  <span className="offerCurrency">{this.props.receiverOffer.srcCurrency}{' '}</span>
                  <span className="offerAmount">{this.props.receiverOffer.remitAmount}</span>
                </div>
              </div>

              <span className="arrowContainer">
              <i className="arrowC la la-arrow-right" />
            </span>

              <div className="offerDetails">
                <span className="offerDetailTop">Received Offer:</span>
                <span className="offerCountry">{this.props.receiverOffer.destCountry}</span>
                <div>
                  <span className="offerCurrency">{this.props.receiverOffer.destCurrency}{' '}</span>
                  <span className="offerAmount">{this.props.receiverOffer.finalAmount}</span>
                </div>
              </div>
            </div>

            {this.props.status == 'new' ?
            <Link
                to={{ pathname: '/ViewCounterOffer', state: { offerObj: this.props.senderOffer, counterOfferId: this.props.counterOfferId, nickName: this.props.senderNickName, counterOfferAmount: this.props.counterOfferAmount, receiverOfferObj:this.props.receiverOffer , type:this.props.type, thirdParty:this.props.thirdParty} }}
                className="customBtn"
            >View Offer</Link> : ""}
          </div>
        </div>
    );
  }
}
