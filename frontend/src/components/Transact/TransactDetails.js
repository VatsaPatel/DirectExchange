import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import backend from '../../../src/helpers/serverDetails';

export class TransactDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      remitAccountId: "",
      destinationAccountId: "",
    };
    this.destinationAccRef = React.createRef();
  }

  calculateAmountRecieved = () => {
    let value =
      this.props.details.offerDetails.exchangeRate *
      parseFloat(this.props.details.offerDetails.remitAmount) *
      0.9995;
    return value.toFixed(2);
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  getRemitAccount() {
    let remitAccount = this.props.bankAccounts
      .filter(
        (account) =>
          account.primaryCurrency ===
            this.props.details.offerDetails.srcCurrency &&
          account.features !== "Recieve"
      )
      .map((accDetails) => {
        return (
          <option value={accDetails.bankAccountId}>
            {accDetails.bankName}-{accDetails.accountNumber}
          </option>
        );
      });

    return remitAccount;
  }
  getDestAccount() {
    let destAccount = this.props.bankAccounts
      .filter(
        (account) =>
          account.primaryCurrency ==
            this.props.details.offerDetails.destCurrency &&
          account.features !== "Send" &&
          account.bankAccountId != this.state.remitAccountId
      )
      .map((accDetails) => {
        return (
          <option value={accDetails.bankAccountId}>
            {accDetails.bankName}-{accDetails.accountNumber}
          </option>
        );
      });
    return destAccount;
  }
  toggleClass() {
    if (
      this.state.remitAccountId !== "" &&
      this.destinationAccRef.current !== null
    ) {
      this.destinationAccRef.current.classList.remove("hidden");
    } else if (this.destinationAccRef.current !== null) {
      this.destinationAccRef.current.classList.add("hidden");
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    let formdata = new FormData();
    formdata.append("offer_id", this.props.details.offerDetails.offerId);
    formdata.append("transaction_id", this.props.details.transactionId);
    formdata.append("remit_accountid", this.state.remitAccountId);
    formdata.append("destination_accountid", this.state.destinationAccountId);

    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));
    axios
      .put(
        `${backend}/directexchange/api/transactions/` +
          decodedToken.sub,
        formdata
      )
      .then((res) => {
        if (res.status === 200) {
          alert("Details have been saved!");
        }
      })
      .catch((err) => {
        alert(err.response.data);
      });

    setTimeout(() => window.location.reload(), 1000);
  };

  render() {
    this.toggleClass();
    let sourceAccounts = this.getRemitAccount();
    let errorMessage = "";

    let destinationAccounts = "";
    if (this.state.remitAccountId !== "") {
      destinationAccounts = this.getDestAccount();
    }

    if (sourceAccounts.length == 0) {
      errorMessage =
        "Please enter a bank account with " +
        this.props.details.offerDetails.srcCurrency +
        " currency";
    } else if (
      destinationAccounts.length == 0 &&
      this.state.remitAccountId != ""
    ) {
      errorMessage =
        "Please enter a bank account with " +
        this.props.details.offerDetails.destCurrency +
        " currency";
    } else {
      errorMessage = "";
    }

    return (
      <div>
        <button
          className="post-offer-button"
          data-toggle="modal"
          data-target={`#transactionDetailsModalPopup` + this.props.details.id}
        >
          Fill Details
        </button>
        <div
          class="modal fade"
          id={`transactionDetailsModalPopup` + this.props.details.id}
          role="dialog"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div
              class="modal-content"
              style={{ width: "850px", height: "300px", background: "#eff2f7" }}
            >
              <div class="modal-body" style={{ padding: "0px" }}>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                  style={{
                    padding: "10px",
                    position: "relative",
                    left: "40px",
                  }}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <form onSubmit={this.onSubmit}>
                  <div className="transaction-details">
                    <h4 class="main-title">Transaction Details</h4>
                    <h6 style={{ color: "red" }}>{errorMessage}</h6>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="remitAccountId"
                        value={this.state.remitAccountId}
                        onChange={this.onChange}
                        required
                      >
                        <option defaultValue value="">
                          Remit Account
                        </option>
                        {sourceAccounts}
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="destinationAccountId"
                        value={this.state.destinationAccountId}
                        ref={this.destinationAccRef}
                        onChange={this.onChange}
                        class="hidden"
                        required
                      >
                        <option defaultValue value="">
                          Receiving Account
                        </option>
                        {destinationAccounts}
                      </select>
                    </div>
                    <div className="btn-footer">
                      <button type="submit" class="custom-btn1">
                        SUBMIT
                      </button>
                    </div>
                  </div>
                  <div className="modal-sidebar" style={{ padding: "50px" }}>
                    <div id="amount-details">
                      <h5>
                        Remit Amount
                        <br />
                        {this.props.details.offerDetails.remitAmount}
                      </h5>
                      <h5>They will recieve</h5>
                      <div class="return-output" style={{ fontSize: "24px" }}>
                        {this.props.details.offerDetails.destCurrency}{" "}
                        {this.calculateAmountRecieved()}
                      </div>
                      <small
                        class="form-text text-muted"
                        style={{ marginBottom: "20px" }}
                      >
                        Includes transaction fee of 0.05%
                      </small>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default TransactDetails;
