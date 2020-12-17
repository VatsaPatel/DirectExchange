import React, {Component} from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import {Redirect} from "react-router";
import TransactItems from "../Transact/TransactItems";
import TransactDetails from "../Transact/TransactDetails";

export default class Home extends Component {

  render() {

    console.log("history: ", this.props.history);
    return (
        <div className="container">
          <div className="card">
            <div className="card-header border-0">
              <h4 className="card-title">Transaction History</h4>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{padding: "10px"}}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
        <div className="card-body pt-0" style={{width:"fit-content"}}>
          <div className="transaction-table">
            <div className="table-responsive">
              <table className="table mb-0 table-responsive-sm">
                <tbody>
                {this.props.history.map(history => {
                  return (
                      <tr>
                        <td>
                          Status
                          <br/>
                      <span >
                        {history[1]}
                      </span>
                        </td>
                        <td>
                          Remit Amount
                          <br/>
                          {history[5]}{" "}
                          {history[4]}
                        </td>
                        <td>
                          Recipient gets
                          <br/>
                          {history[7]}{" "}
                          {(+history[4]) * (+history[6]).toFixed(2)}
                        </td>
                        <td>
                          Exchange Rate
                          <br/>
                          {Math.round(history[6] * 1000) /
                          1000}
                        </td>
                        <td>
                          User
                          <br/>
                          {history[3].substring(0,2)}
                        </td>
                        <td>
                          At-fault
                          <br/>
                          {history[8] == 1? "No" : "Yes"}
                        </td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
          </div>
        </div>

    )
  }
}