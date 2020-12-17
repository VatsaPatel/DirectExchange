import React, { Component } from "react";
import { currencyList, countries } from "../../helpers/currencies";
import { exchangerates } from "../../helpers/exchangerates";
import axios from "axios";
import jwt_decode from "jwt-decode";
import backend from '../../../src/helpers/serverDetails';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
  getExpiryDate = (datestring) => {
    var year = datestring.substring(0, 4);
    var month = datestring.substring(5, 7);
    var day = datestring.substring(8, 10);
    return new Date(year, month - 1, day, 0, 0, 0, 0)
      .toISOString()
      .substr(0, 10);
  };
  componentDidMount() {
    this.setState({
      source_currency: this.props.srcCurrency,
      destination_currency: this.props.destCurrency,
      source_country: this.props.srcCountry,
      destination_country: this.props.destCountry,
      amount: this.props.remitAmount,
      expirationdate: this.getExpiryDate(this.props.expDate),
      minDate: "",
      allowCounterOffers: this.props.counterOfferFlag,
      allowOfferSplit: this.props.splitOfferFlag,
    });
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
      let value =
        exchangerates[this.state.source_currency][
          this.state.destination_currency
        ] *
        parseFloat(this.state.amount).toFixed(2) *
        0.9995;
      return value.toFixed(2);
    }
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleCheckboxChange = (event) =>
    this.setState({ [event.target.name]: event.target.checked });
  onSubmit = (event) => {
    event.preventDefault();
    if (
      this.state.source_currency === this.state.destination_currency &&
      this.state.source_country === this.state.destination_country
    ) {
      alert("Please select different countries");
    } else {
      axios.defaults.headers.common["authorization"] =
        "Bearer " + localStorage.getItem("token");
      var decodedToken = jwt_decode(localStorage.getItem("token"));

      let data = {
        amount: parseFloat(this.state.amount),
        exchange_rate:
          exchangerates[this.state.source_currency][
            this.state.destination_currency
          ],
        source_currency: this.state.source_currency,
        source_country: this.state.source_country,
        destination_currency: this.state.destination_currency,
        destination_country: this.state.destination_country,
        expirationdate: this.state.expirationdate,
        allowCounterOffers: this.state.allowCounterOffers,
        allowOfferSplit: this.state.allowOfferSplit,
      };

      axios
        .put(
          `${backend}/directexchange/api/postoffer/` +
            decodedToken.sub +
            "/" +
            this.props.offer.offerId,
          data
        )
        .then((res) => {
          if (res.status === 200) {
            alert("Offer has been edited!");
          }
        })
        .catch((err) => {
          console.log(err.response);
          alert(err.response.data);
        });
    }
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
  toggleClass() {
    if (
      this.state.source_currency !== "" &&
      this.state.destination_currency !== "" &&
      this.state.amount !== ""
    ) {
      this.amountDetailsRef.current.classList.remove("hidden");
    } else if (this.amountDetailsRef.current !== null) {
      this.amountDetailsRef.current.classList.add("hidden");
    }
  }
  render() {
    let sourceCountries = null;
    let destinationCountries = null;
    this.toggleClass();

    if (
      this.state.source_currency !== "" &&
      this.state.source_currency !== undefined
    ) {
      sourceCountries = this.getCountries(this.state.source_currency);
    }
    if (
      this.state.destination_currency !== "" &&
      this.state.destination_currency !== undefined
    ) {
      destinationCountries = this.getCountries(this.state.destination_currency);
    }
    return (
      <div className="container" style={{ textAlign: "left" }}>
        <div
          className="col-md-6"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <div className="offerContainer">
            <span>
              Status: <span className="postedBy">{this.props.status}</span>{" "}
              {this.props.status === "Open" ? (
                <i
                  style={{ float: "right" }}
                  class="fa fa-pencil"
                  aria-hidden="true"
                  data-toggle="modal"
                  data-target={
                    `#editOfferModalPopup` + this.props.offer.offerId
                  }
                ></i>
              ) : null}
            </span>
            <span>
              Offer Split Allowed:{" "}
              <span className="postedBy">
                {this.props.splitOfferFlag ? "Yes" : "No"}
              </span>
            </span>
            <span>
              Counter Offer Allowed:{" "}
              <span className="postedBy">
                {this.props.counterOfferFlag ? "Yes" : "No"}
              </span>
            </span>
            <span>
              Expires:{" "}
              <span className="postedBy">
                {this.props.expDate.toString().substring(0, 10)}
              </span>
            </span>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                margin: "10px 0",
              }}
            >
              <div className="offerDetails">
                <span className="offerDetailTop">From:</span>
                <span className="offerCountry">{this.props.srcCountry}</span>
                <div>
                  <span className="offerCurrency">
                    {this.props.srcCurrency}{" "}
                  </span>
                  <span className="offerAmount">{this.props.remitAmount}</span>
                </div>
              </div>

              <span className="arrowContainer">
                <i className="arrowC la la-arrow-right" />
              </span>

              <div className="offerDetails">
                <span className="offerDetailTop">To:</span>
                <span className="offerCountry">{this.props.destCountry}</span>
                <div>
                  <span className="offerCurrency">
                    {this.props.destCurrency}{" "}
                  </span>
                  <span className="offerAmount">{this.props.finalAmount}</span>
                </div>
              </div>
            </div>

            {this.props.status === "Open" ? (
              <button
                className="customBtn"
                onClick={() => this.props.getAllOffers(this.props.offer)}
              >
                Find Matching Offers
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
        <div
          class="modal fade"
          id={`editOfferModalPopup` + this.props.offer.offerId}
          role="dialog"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div
              class="modal-content"
              style={{ width: "850px", background: "#eff2f7" }}
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
                  onClick={this.props.handleRefresh.bind(this)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
                <form onSubmit={this.onSubmit}>
                  <div className="offer-details">
                    <h4 class="main-title">Offer Details</h4>

                    <div class="form-group">
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        class="form-control"
                        placeholder="Amount"
                        name="amount"
                        value={this.state.amount}
                        onChange={this.onChange}
                        required
                      />
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="source_currency"
                        value={this.state.source_currency}
                        onChange={this.onChange}
                        required
                      >
                        <option defaultValue value="">
                          Source Currency
                        </option>
                        {this.getCurrencies()}
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="source_country"
                        value={this.state.source_country}
                        onChange={this.onChange}
                        required
                      >
                        <option defaultValue value="">
                          Source Country
                        </option>
                        {sourceCountries}
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="destination_currency"
                        value={this.state.destination_currency}
                        onChange={this.onChange}
                        required
                      >
                        <option defaultValue value="">
                          Destination Currency
                        </option>
                        {this.getCurrencies()}
                      </select>
                    </div>
                    <div class="form-group">
                      <select
                        class="form-control"
                        name="destination_country"
                        value={this.state.destination_country}
                        onChange={this.onChange}
                        required
                      >
                        <option defaultValue value="">
                          Destination Country
                        </option>
                        {destinationCountries}
                      </select>
                    </div>
                    <div class="form-group">
                      <input
                        type="date"
                        class="form-control"
                        placeholder="Expiration Date"
                        min={this.getMinDate()}
                        name="expirationdate"
                        value={this.state.expirationdate}
                        onChange={this.onChange}
                        required
                      />
                      <small class="form-text text-muted">
                        Please select an expiration date for this offer
                      </small>
                    </div>
                    <button type="submit" class="custom-btn1">
                      SAVE
                    </button>
                  </div>
                  <div className="modal-sidebar">
                    <div
                      ref={this.amountDetailsRef}
                      id="amount-details"
                      class="hidden"
                    >
                      <h5>They will recieve</h5>
                      <div class="return-output">
                        {this.state.destination_currency}{" "}
                        {this.calculateAmountRecieved()}
                      </div>
                      <small
                        class="form-text text-muted"
                        style={{ marginBottom: "20px" }}
                      >
                        Includes transaction fee of 0.05%
                      </small>
                      <div
                        class="form-group form-check"
                        style={{ marginBottom: "0px" }}
                      >
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="allowCounterOffers"
                          onChange={this.handleCheckboxChange}
                          checked={this.state.allowCounterOffers}
                        />
                        <label class="form-check-label">
                          Allow Counter offers
                        </label>
                      </div>
                      <div class="form-group form-check">
                        <input
                          type="checkbox"
                          class="form-check-input"
                          name="allowOfferSplit"
                          onChange={this.handleCheckboxChange}
                          checked={this.state.allowOfferSplit}
                        />
                        <label class="form-check-label">
                          Allow Offer split
                        </label>
                      </div>
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
