import React, { Component } from "react";

export class ReportItems extends Component {
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
          <small> Exchange Rate</small>
          <br />
          {Math.round(this.props.details.offerDetails.exchangeRate * 1000) /
            1000}
        </td>
      </tr>
    );
  }
}

export default ReportItems;

