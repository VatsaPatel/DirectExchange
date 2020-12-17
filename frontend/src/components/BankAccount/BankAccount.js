import React, { Component } from "react";
import Header from "../Navigation/Header";
import SideBar from "../Navigation/SideBar";
import { currencyList, countries } from "../../helpers/currencies";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { Redirect } from 'react-router-dom'
import backend from '../../../src/helpers/serverDetails';

export class BankAccount extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
    this.getBankAccounts();
  }

  getBankAccounts = () => {
    var redirecturl = null;
    if(localStorage.getItem('token')) {
    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));
    console.log("decodedUserId: ", decodedToken.sub);

    axios
      .get(
        `${backend}/directexchange/bank-accounts/` + decodedToken.sub
      )
      .then((response) => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          console.log("Fetched All Bank Accounts: ", response.data);
          this.setState({
            myBankAccounts: response.data,
          });
        }
      })
      .catch((error) => {
        console.log("Here we captured the error: ", error);
        this.setState({
          myBankAccounts: null,
        });
      });
    } else {
      redirecturl = <Redirect to="/login"/>;
  }
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  bankDetails = (myBankAccounts) => {
    var bankDetailsDisplay = [];
    myBankAccounts.map((account) => {
      var bankDetailDisplay = (
        <div key={account.bankAccountId}
          className="col-md-6"
          style={{ display: "flex", justifyContent: "center", marginLeft:'25%' }}
        >
        <div className="offerContainer" style={{width:'200%'}}>
          <br/>
          <span className="bankDetailsHeading">
            Bank Name: &emsp; <span className="bankDetails">{account.bankName}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
            Account Number: &emsp; <span className="bankDetails">{account.accountNumber}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
            Owner Name: &emsp; <span className="bankDetails">{account.ownerName}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
            Owner Address: &emsp; <span className="bankDetails">{account.ownerAddress}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
            Primary Currency: &emsp; <span className="bankDetails">{account.primaryCurrency}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
          Country: &emsp; <span className="bankDetails">{account.country}</span>
          </span>
          <br/>
          <span className="bankDetailsHeading">
          Features: &emsp; <span className="bankDetails">{account.features}</span>
          </span>
          <br/>
        </div>
      </div>
      );
      bankDetailsDisplay.push(bankDetailDisplay);
    });
    return bankDetailsDisplay;
  }
  
  render() {

    let countries = null, banksToDisplay = null;

    if (
      this.state.primaryCurrency !== "" &&
      this.state.primaryCurrency !== undefined
    ) {
      countries = this.getCountries(this.state.primaryCurrency);
    }

    if(this.state.myBankAccounts) {
      banksToDisplay = this.bankDetails(this.state.myBankAccounts);
      if (banksToDisplay.length === 0) {
        banksToDisplay = (
          <div
            className="col-md-6"
            style={{ display: "flex", justifyContent: "center", marginLeft:'25%' }}
            >
            <div className="offerContainer" style={{width:'200%'}}>
              <span className="bankDetailsHeading">
                No Bank Accounts To Display.
              </span>
            </div>
          </div>
        );
      }
    }

    var redirectUrl = null;

    if(!localStorage.getItem('token')) {
      redirectUrl = <Redirect to="/login"/>;
    }

    console.log("msg from java controller: ", this.state.msg);

    return (
        <div>
        {redirectUrl}
            <Header/>
            <SideBar/>
            <div className="content-body">
                <div className="myContainer">
                <span className="PageTitle">Bank Account Details</span>
                <br/>
                <a href='/addAccount' className="btn btn-success myButton" style={{width:'20%'}}>Add an Account</a>
                <br/>
                    {banksToDisplay}
                </div>
            </div>
        </div>
    );
  }
}

export default BankAccount;
