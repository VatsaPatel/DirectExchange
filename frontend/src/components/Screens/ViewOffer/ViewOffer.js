import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import StarRatings from 'react-star-ratings';
import Header from "../../Navigation/Header";
import SideBar from "../../Navigation/SideBar";
import jwt_decode from "jwt-decode";
import {Redirect} from "react-router";
import backend from '../../../../src/helpers/serverDetails';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      message: null,
      showMessage: false,
      rejectFlag:null,
    };

    this.rejectCounterHandler = this.rejectCounterHandler.bind(this);
    this.acceptSingleOfferHandler = this.acceptSingleOfferHandler.bind(this);
  }

  sendMessage=()=>{

    let formdata = new FormData();
    formdata.append("receiver_name", this.props.location.state.offerObj.user.nickName);
    formdata.append("receiver_email", this.props.location.state.offerObj.user.emailId);
    formdata.append("message", this.state.message);
    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));
    axios
      .post(
        `${backend}/directexchange/api/message/` +
          decodedToken.sub,
        formdata
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      });
  }


  rejectCounterHandler = (e) => {
    e.preventDefault();

    axios.defaults.headers.common["authorization"] =
        "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    var data = {
      counterOfferId: this.props.location.state.counterOfferId,
      senderInitialOfferId: this.props.location.state.offerObj.offerId,
      rejectMsgFromUser: this.props.location.state.receiverOfferObj.user.nickName,
      rejectMsgToEmail: this.props.location.state.offerObj.user.emailId,
    }

    axios.put(`${backend}/directexchange/user/counteroffer`, data)
        .then(response => {
          console.log("Status Code : ", response.status);
          if (response.status === 200) {
            console.log("Posted Counter Offers: ", response.data);
            this.setState({
              rejectFlag: true,
            })
          }else{
            this.setState({
              rejectFlag: false,
            })
          }
        })
        .catch(error => {
          console.log("Here we captured the error: ", error)
          this.setState({
            rejectFlag: false,
          })
        });


  }

  acceptSingleOfferHandler(e){

    e.preventDefault();

    axios.defaults.headers.common["authorization"] =
        "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    var data = {
      source_offer: this.props.location.state.receiverOfferObj,
      offers_matched: this.props.location.state.offerObj,
      source_offer_amount: this.props.location.state.counterOfferAmount,
    }

    console.log("counter offer data: ", data);

    // axios.post(`${backend}/directexchange/api/transactions/` + decodedToken.sub, data)
    //     .then(response => {
    //       console.log("Status Code : ", response.status);
    //       if (response.status === 200) {
    //         console.log("Posted Counter Offers: ", response.data);
    //         this.setState({
    //           transactionFlag: true,
    //         })
    //       }else{
    //         this.setState({
    //           transactionFlag: false,
    //           transactionMsg: response.data
    //         })
    //       }
    //     })
    //     .catch(error => {
    //       console.log("Here we captured the error: ", error)
    //       this.setState({
    //         transactionFlag: false,
    //       })
    //     });

  }


  render() {
    let OfferObj = this.props.location.state.offerObj;
    let nickName = this.props.location.state.nickName;
    let counterOfferAmount = this.props.location.state.counterOfferAmount;
    let receiverOfferObj = this.props.location.state.receiverOfferObj;
    let counterOfferId = this.props.location.state.counterOfferId;

    console.log(OfferObj);
    console.log("counterOfferId: ", counterOfferId);
    console.log("sender: ", OfferObj);
    console.log("receiver: ", receiverOfferObj);

    var errorMsg = "";
    var redirectVar = "";

    if(this.state.rejectFlag == false){
      errorMsg = <div style={{color:"red"}}>Couldn't reject counter offer, Try after sometime.</div>
    }else if(this.state.rejectFlag){
      redirectVar = <Redirect to={{ pathname: "/viewCounterOffers"}} />
    }


    return (
      <div>
        {redirectVar}
        <Header />
        <SideBar />

        <div className="content-body">
          <div className="myContainer">
            <span className="PageTitle">View Offer Details</span>

            <div
              className="col-md-10"
              style={{
                maxWidth: "800px",
                alignSelf: "center",
                marginTop: "30px",
              }}
            >
              <div className="card">
                <div className="card-body">
                  <div className="buyer-seller">
                    <div className="d-flex justify-content-between mb-3">
                      <div className="buyer-info">
                        <div className="media">
                          <div className="media-body">
                            <h6>Posted By</h6>
                            <h4>
                              <span class="userThumb">
                                <i class="mdi mdi-account"></i>
                              </span>
                              {OfferObj.user.nickName}
                              <span>
                                  {OfferObj.user.rating > 0 ?
                                      <span >&nbsp;{OfferObj.user.rating}&nbsp;
                                        <StarRatings rating={1} starRatedColor="red" starDimension='17px' numberOfStars={1} name='rating'/>
                                      </span>
                                      : ""}
                              </span>

                            </h4>
                          { !this.state.showMessage ?
                            <button
                              className="btn btn-primary myButton2"
                              style={{ height: "30px", marginLeft: "38px" }}
                              onClick={(e) =>
                                this.setState({ showMessage: true })
                              }
                            >
                              Message
                            </button> : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                    { this.state.showMessage ?
                      <div className="form-row" style={{justifyContent: 'flex-end'}}>
                        <div className="col-md-12">
                          <textarea
                            type="text"
                            className="form-control"
                            placeholder="Enter Message"
                            onChange={(e) => this.setState({message: e.target.value})}
                          />
                        </div>
                        <button className="btn btn-primary myButton" onClick={(e) =>this.sendMessage()}>Send Message!</button>
                      </div>
                    : ''}
                    <div className="table-responsive">
                      <table className="table">
                        <tbody>
                          <tr>
                            <td>
                              <span>Source Country</span>
                            </td>
                            <td>
                              <span>{OfferObj.srcCountry}</span>
                            </td>
                          </tr>
                          <tr>
                            <td>Remit Amount</td>
                            <td>
                              {OfferObj.srcCurrency} {OfferObj.remitAmount}
                            </td>
                          </tr>

                          {counterOfferAmount ? (
                            <tr>
                              <td>Counter Offer Amount</td>
                              <td>
                                {OfferObj.srcCurrency} {counterOfferAmount}
                              </td>
                            </tr>
                          ) : (
                            ""
                          )}
                          <tr>
                            <td>Exchange Rate</td>
                            <td>{OfferObj.exchangeRate}</td>
                          </tr>
                          <tr>
                            <td>Destination Country</td>
                            <td>{OfferObj.destCountry}</td>
                          </tr>
                          <tr>
                            <td>Final Exchanges Amount</td>
                            <td>
                              {OfferObj.destCurrency} {OfferObj.finalAmount}
                            </td>
                          </tr>
                          <tr>
                            <td>Expiry Date</td>
                            <td>{Date(OfferObj.expDate)}</td>
                          </tr>
                          <tr>
                            <td>Offer Split Allowed</td>
                            <td>{OfferObj.splitOfferFlag ? "Yes" : "No"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/*<div style={{ display: "flex", justifyContent: "center" }}>*/}
                    {/*  <button*/}
                    {/*      type="submit"*/}
                    {/*      className="post-counter-offer-custom-button"*/}
                    {/*      style={{ marginRight:"50px", marginTop:"0px", height:"45px" }}*/}
                    {/*      onClick={this.acceptSingleOfferHandler}*/}
                    {/*  >*/}
                    {/*    Accept Offer{" "}*/}
                    {/*  </button>*/}

                    {/*  { counterOfferId && counterOfferId.length !== 0 ?*/}
                    {/*  <button*/}
                    {/*      type="submit"*/}
                    {/*      className="post-counter-offer-custom-button"*/}
                    {/*      style={{ marginRight:"50px", marginTop:"0px", height:"45px" }}*/}
                    {/*      onClick={this.rejectCounterHandler}*/}
                    {/*  >*/}
                    {/*    Reject Offer*/}
                    {/*  </button>*/}
                    {/*  : "" }*/}

                    {/*  {(OfferObj.counterOfferFlag && !counterOfferId) ? (*/}
                    {/*    <Link*/}
                    {/*      to={{*/}
                    {/*        pathname: "/ViewOffer",*/}
                    {/*        state: { offerObj: this.props.offerObj },*/}
                    {/*      }}*/}
                    {/*      className="btn btn-primary myButton"*/}
                    {/*    >*/}
                    {/*      Counter Offer*/}
                    {/*    </Link>*/}
                    {/*  ) : (*/}
                    {/*    ""*/}
                    {/*  )}*/}
                    {/*</div>*/}
                    <br />
                    <div style={{textAlign:"center"}}>{errorMsg}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
