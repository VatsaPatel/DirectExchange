import React, { Component } from "react";
import TransactDetails from "./TransactDetails";
import axios from "axios";
import jwt_decode from "jwt-decode";
import backend from "../../../src/helpers/serverDetails";

export class TransactItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      receiptAmount: 0,
      source_currency: "",
      destination_currency: "",
      source_country: "",
      destination_country: "",
      amount: "",
      expirationdate: "",
      minDate: "",
      allowCounterOffers: true,
      allowOfferSplit: true,
    };
    this.amountDetailsRef = React.createRef();
  }

  getMinDate = () => {
    let d = new Date();
    let nextDay = d.setDate(d.getDate() + 1);
    return new Date(nextDay).toISOString().substr(0, 10);
  };
  calculateAmountRecieved = () => {
    if (
      this.state.source_currency !== "" &&
      this.state.destination_currency !== "" &&
      this.state.amount !== ""
    ) {
      let value = parseFloat(this.state.amount).toFixed(2) * 0.9995;
      return value.toFixed(2);
    }
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCheckboxChange = (event) =>
    this.setState({ [event.target.name]: event.target.checked });

  componentDidMount() {
    this.setState({
      receiptAmount:
        this.props.details.offerDetails.exchangeRate *
        parseFloat(this.props.details.offerDetails.remitAmount).toFixed(2) *
        0.9995,
    });
  }
  fillDetails = () => {
    let formdata = new FormData();
    formdata.append("offer_id", this.props.details.offerDetails.offerId);
    formdata.append("transaction_id", this.props.details.transactionId);
    console.log(this.props.details.transactionId);
    axios.defaults.headers.common["authorization"] =
      "Bearer " + localStorage.getItem("token");
    var decodedToken = jwt_decode(localStorage.getItem("token"));
    axios
      .put(
        `${backend}/directexchange/api/transactions/` + decodedToken.sub,
        formdata
      )
      .then((res) => {
        if (res.status === 200) {
          window.location.reload();
        }
      });
  };

  render() {
    let classValue = "badge badge-danger";

    if (this.props.details.transactionStatus === "pending") {
      classValue = "badge badge-warning";
    } else if (this.props.details.transactionStatus === "completed") {
      classValue = "badge badge-success";
    }

    return (
      <tr>
        <td>
          <span class={classValue}>
            {this.props.details.transactionStatus.toUpperCase()}
          </span>
        </td>
        <td>
          <small>Date</small>
          <br />
          {this.props.details.expirationDate.substr(0, 10)}
        </td>
        <td>
          <small> Remit Amount</small>
          <br />
          {this.props.details.offerDetails.srcCurrency}{" "}
          {this.props.details.offerDetails.remitAmount}
        </td>
        <td>
          <small>Final Amount</small>
          <br />
          {this.props.details.offerDetails.destCurrency}{" "}
          {this.props.details.offerDetails.finalAmount} <br />
        </td>
        <td>
          <small>Service Fees</small>
          <br />
          {this.props.details.offerDetails.destCurrency}{" "}
          {(
            parseFloat(this.props.details.offerDetails.finalAmount) * 0.0005
          ).toFixed(2)}{" "}
        </td>
        <td>
          <br />
          <small>Recipient gets</small>
          <br />
          {this.props.details.offerDetails.destCurrency}{" "}
          {this.state.receiptAmount.toFixed(2)}
          <br />
          <small>
            <em>*total after service fees</em>
          </small>
        </td>
        <td>
          <small> Exchange Rate</small>
          <br />
          {Math.round(this.props.details.offerDetails.exchangeRate * 1000) /
            1000}
        </td>
        {this.props.details.transactionStatus === "pending" ? (
          <td class="text-danger">
            {this.props.details.is_complete ? (
              <React.Fragment>Waiting for other parties</React.Fragment>
            ) : (
              <TransactDetails
                details={this.props.details}
                bankAccounts={this.props.bankAccounts}
              />
            )}
          </td>
        ) : (
          <td style={{ fontWeight: "500" }}>
            Transaction has been {this.props.details.transactionStatus}
          </td>
        )}
      </tr>
    );
  }
}

export default TransactItems;
