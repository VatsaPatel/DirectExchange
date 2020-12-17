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
  }

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getCurrencies = () => {
    let currencies = currencyList.map((curr) => {
      return (
        <option key={curr.code} value={curr.code}>
          {curr.name} - {curr.code}
        </option>
      );
    });
    return currencies;
  };
  getCountries = (currency) => {
    let listofcountries = countries[currency].split("|");
    let countriesList = listofcountries
      .filter((name) => name !== "")
      .map((name) => {
        return <option value={name}>{name}</option>;
      });
    return countriesList;
  };

  addBankAccount = (e) => {
    e.preventDefault();
    const data = {
      bankName : this.state.bankName,
      accountNumber : this.state.accountNumber,
      ownerName : this.state.ownerName,
      ownerAddress : this.state.ownerAddress,
      primaryCurrency : this.state.primaryCurrency,
      country : this.state.country,
      features : this.state.features
    }
    console.log("Update Profile: ", data);

    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem('token'));
    axios.post(`${backend}/directexchange/bank-accounts/` + decodedToken.sub, data)
        .then(response => {
            console.log("Status Code : ", response.status);
            if (response.status === 200) {
                console.log("Successfully Added Bank Details: ", response.data);
                this.setState({
                    bankName:'',
                    accountNumber : '',
                    ownerName : '',
                    ownerAddress : '',
                    primaryCurrency : '',
                    country : '',
                    features : '',
                    successFlag: true,
                });
            }
        })
        .catch(error => {
            console.log("Error ******** :", error);
            this.setState({
                successFlag: false,
                errorFlag:true,
                msg: error.response.data
            })
        });

      }
  
  render() {

    let countries = null;

    if (
      this.state.primaryCurrency !== "" &&
      this.state.primaryCurrency !== undefined
    ) {
      countries = this.getCountries(this.state.primaryCurrency);
    }

    var message = null, redirectUrl = null;
        
    if (this.state.successFlag === true) {
        message = <div class="alert alert-success" role="alert">Bank Account Added Successfully!</div>
        
    } else if (this.state.errorFlag === true) {
        message = <div class="alert alert-danger" role="alert">{this.state.msg}</div>
    }

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
                    <span className="PageTitle">Bank Account Setup</span>
                    <br/>
                    <br/>
                    <div className="col-md-8" style={{marginTop:'20px', alignSelf: 'center'}}>
                      <div className="card">
                        <div className="buy-sell-widget">
                        <br/>
                        <br/>
                        <center>
                          <h3>Please Provide Bank Details</h3>
                          <br/>
                          <form onSubmit={this.addBankAccount} >
                          <table>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Bank name :
                              </td>
                              <td>
                                <input name="bankName" type="text" className="form-control"
                                style = {{fontSize:'20px'}} required value={this.state.bankName}
                                onChange={this.onChange}
                              />
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Account Number :
                              </td>
                              <td>
                                <input name="accountNumber" type="number" min="0" className="form-control"
                                style = {{fontSize:'20px'}} required value={this.state.accountNumber}
                                onChange={this.onChange}
                              />
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Owner Name :
                              </td>
                              <td>
                                <input name="ownerName" type="text" className="form-control" 
                                style = {{fontSize:'20px'}} required value={this.state.ownerName}
                                onChange={this.onChange}
                              />
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Owner Address :
                              </td>
                              <td>
                                <input name="ownerAddress" type="text" className="form-control"
                                style = {{fontSize:'20px'}} required value={this.state.ownerAddress}
                                onChange={this.onChange}
                              />
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Primary Currency :
                              </td>
                              <td>
                              <select class="form-control" name="primaryCurrency" style = {{fontSize:'20px'}}
                                value={this.state.primaryCurrency} onChange={this.onChange} required
                              >
                                <option defaultValue value="">
                                Select Currency
                                </option>
                                {this.getCurrencies()}
                              </select>
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Country :
                              </td>
                              <td>
                              <select class="form-control" name="country" style = {{fontSize:'20px'}}
                                value={this.state.country} onChange={this.onChange} required
                              >
                                <option defaultValue value="">
                                Select Country
                                </option>
                                {countries}
                              </select>
                              </td>
                            </tr>
                            <br/>
                            <tr>
                              <td style={{fontSize:'24px'}}>
                                Features :
                              </td>
                              <td>
                              <select name="features" className="form-control" style = {{fontSize:'20px'}} 
                              value={this.state.features} onChange={this.onChange} required>
                                <option defaultValue value="">Select option</option>
                                <option defaultValue value="Send">Only Send</option>
                                <option defaultValue value="Receive">Only Receive</option>
                                <option defaultValue value="Both">Send and Receive</option>
                              </select>
                              </td>
                            </tr>
                          </table>
                          <br/>
                          <br/>
                          {message}
                          <br/>

                          <button class="btn btn-success myButton"
                          type="submit">
                          Submit
                          </button>
                          &emsp;
                          <a href='/account' class="btn myButton" style={{width:'20%', background:"#007bff"}}>View Accounts</a>
                          </form>
                          <br/>
                          <br/>
                          </center>
                          
                        </div>
                      </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

export default BankAccount;
