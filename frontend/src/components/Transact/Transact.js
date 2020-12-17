import React, { Component } from "react";
import axios from "axios";
import Header from "../Navigation/Header";
import SideBar from "../Navigation/SideBar";
import TransactItems from "./TransactItems";
import jwt_decode from "jwt-decode";
import "./Transact.css";
import backend from '../../../src/helpers/serverDetails';

export class Transact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDetails: [],
      bankAccounts: [],
    };
  }
  componentDidMount() {
    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    axios
      .get(
        `${backend}/directexchange/api/transactions/` +
          decodedToken.sub
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            transactionDetails: response.data.transactionDetails,
            bankAccounts: response.data.bankAccounts,
          });
        }
      })
      .catch((err) => {
        alert("Something went wrong! Please try again later.");
      });
  }

  render() {
    return (
      <div>
        <Header />
        <SideBar />

        <div className="content-body">
          <div className="container">
            <div class="card">
              <div class="card-header border-0">
                <h4 class="card-title">Transaction Details</h4>
              </div>
              <div class="card-body pt-0">
                <div class="transaction-table">
                  <div class="table-responsive">
                    <table class="table mb-0 table-responsive-sm">
                      <tbody>
                        {this.state.transactionDetails.map((details, index) => {
                          return (
                            <TransactItems
                              key={index}
                              details={details}
                              bankAccounts={this.state.bankAccounts}
                            />
                          );
                        })}
                      </tbody>
                    </table>
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

export default Transact;
