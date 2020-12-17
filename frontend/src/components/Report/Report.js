import React, { Component } from "react";
import Header from "../Navigation/Header";
import SideBar from "../Navigation/SideBar";
import ReportItems from "./ReportItems";
import axios from "axios";
import jwt_decode from "jwt-decode";
import backend from "../../../src/helpers/serverDetails";

export class Report extends Component {
  constructor(props) {
    super(props);
    this.state = {
      completedTransactions: 0,
      uncompleteTransactions: 0,
      totalRemitAmount: 0,
      transactionDetails: [],
    };
  }
  componentDidMount() {
    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));

    axios
      .get(
        `${backend}/directexchange/api/transactions/systemreport/` +
          decodedToken.sub
      )
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            completedTransactions: response.data.completedTransactions,
            uncompleteTransactions: response.data.uncompleteTransactions,
            totalRemitAmount: response.data.totalRemitAmount,
            transactionDetails: response.data.transactionDetails,
          });
          console.log(response.data);
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
        <div class="content-body">
          <div class="container">
            <div class="row">
              <div class="col-xl-12">
                <div class="row">
                  <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="widget-card">
                      <div class="widget-title">
                        <h5>Completed Transactions</h5>
                      </div>

                      <div class="widget-info">
                        <h3>{this.state.completedTransactions}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="widget-card">
                      <div class="widget-title">
                        <h5>Uncompleted Transactions</h5>
                      </div>
                      <div class="widget-info">
                        <h3>{this.state.uncompleteTransactions}</h3>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="widget-card">
                      <div class="widget-title">
                        <h5>Total Remit Amount</h5>
                      </div>
                      <div class="widget-info">
                        <h3>{this.state.totalRemitAmount}</h3>
                        <p>USD</p>
                      </div>
                    </div>
                  </div>
                  <div class="col-xl-3 col-lg-6 col-md-6">
                    <div class="widget-card">
                      <div class="widget-title">
                        <h5>Total Service Fees</h5>
                      </div>
                      <div class="widget-info">
                        <h3>
                          {(
                            parseFloat(this.state.totalRemitAmount) * 0.0005
                          ).toFixed(2)}
                        </h3>
                        <p>USD</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">All Transaction Details </h4>
                  </div>
                  <div class="card-body">
                    <div class="transaction-widget">
                      <ul class="list-unstyled">
                        <table class="table mb-0 table-responsive-sm">
                          <tbody>
                            {this.state.transactionDetails.map(
                              (details, index) => {
                                return (
                                  <ReportItems key={index} details={details} />
                                );
                              }
                            )}
                          </tbody>
                        </table>
                      </ul>
                    </div>
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

export default Report;
