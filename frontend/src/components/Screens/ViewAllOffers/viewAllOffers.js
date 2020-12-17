import React, { Component } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { Redirect } from "react-router-dom";
import Header from "../../Navigation/Header";
import SideBar from "../../Navigation/SideBar";
import Pagination from "./Pagination";
import { currencyList, countries } from "../../../helpers/currencies";
import OfferComponent from "./offerComponent";
import backend from '../../../../src/helpers/serverDetails';

export default class Home extends Component {
  constructor() {
    super();

    this.state = {
      srcCountry: null,
      srcCurrency: null,
      srcPriceStart: null,
      srcPriceEnd: null,
      destCountry: null,
      destCurrency: null,
      destPriceStart: null,
      destPriceEnd: null,
      dataFetched: {},
      isLoading: true,
    };
  }

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

  componentDidMount() {
    if (localStorage.getItem("token")) {
      axios.defaults.headers.common["authorization"] =
        "Bearer " + localStorage.getItem("token");
      var decodedToken = jwt_decode(localStorage.getItem("token"));
      axios
        .get(
          `${backend}/directexchange/user/allOffers/` +
            decodedToken.sub
        )
        .then((response) => {
          if (response.status === 200) {
            this.setState({ dataFetched: response.data, isLoading: false });
          }
        })
        .catch((error) => {
          console.log("Here we captured the error: ", error);
          this.setState({ dataFetched: null, isLoading: true });
        });
    }
  }

  filterUpdate = (event, type) => {
    let keyword = event.target.value;
    if (keyword === "" || keyword === "true") keyword = null;
    this.setState({ [type]: keyword });
  };

  render() {
    const offers = Object.assign([], this.state.dataFetched);
    console.log(this.state);
    const items = offers
      .filter((offerObj) => {
        if (this.state.srcCountry == null) return offerObj;
        else if (offerObj.srcCountry.includes(this.state.srcCountry))
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.srcCurrency == null) return offerObj;
        else if (offerObj.srcCurrency.includes(this.state.srcCurrency))
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.srcPriceStart == null) return offerObj;
        else if (offerObj.remitAmount >= this.state.srcPriceStart)
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.srcPriceEnd == null) return offerObj;
        else if (offerObj.remitAmount <= this.state.srcPriceEnd)
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.destCountry == null) return offerObj;
        else if (offerObj.destCountry.includes(this.state.destCountry))
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.destCurrency == null) return offerObj;
        else if (offerObj.destCurrency.includes(this.state.destCurrency))
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.destCurrency == null) return offerObj;
        else if (offerObj.destCurrency.includes(this.state.destCurrency))
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.destPriceStart == null) return offerObj;
        else if (offerObj.finalAmount >= this.state.destPriceStart)
          return offerObj;
      })
      .filter((offerObj) => {
        if (this.state.destPriceEnd == null) return offerObj;
        else if (offerObj.finalAmount <= this.state.destPriceEnd)
          return offerObj;
      })
      .map((offerObj) => {
        return (
          <OfferComponent
            offerObj={offerObj}
            key={offerObj.offerId}
            postedBy={offerObj.user.nickName}
            srcCountry={offerObj.srcCountry}
            srcCurrency={offerObj.srcCurrency}
            remitAmount={offerObj.remitAmount}
            destCurrency={offerObj.destCurrency}
            destCountry={offerObj.destCountry}
            finalAmount={offerObj.finalAmount}
          />
        );
      });

    const array = Array(400)
        .fill(0)
        .map((_, i) => i);

    const totalPages = Math.ceil(items.length / 10);

      const Elemento = ({ item }) => (
        <>
          <h4>Este é o elemnto {item}</h4>
        </>
      );

    var redirectUrl = null;

    if (!localStorage.getItem("token")) {
      redirectUrl = <Redirect to="/login" />;
    }

    return (
      <div>
        {redirectUrl}
        <Header />
        <SideBar />

        <div className="content-body">
          <div className="myContainer">
            <span className="PageTitle">View All Offers</span>

            <div className="row" style={{marginTop: '40px'}}>
              <div className="col-xl-3">
                <div className="card">
                  <div className="card-body">
                    <h4 className="card-title">Filters</h4>
                    <div style={{ marginTop: "30px" }}>
                      <div className="myFormGroup form-group">
                        <label className="myInputLabel">Source Country</label>

                        <select
                          className="form-control"
                          onChange={(e) => this.filterUpdate(e, "srcCountry")}
                        >
                          <option value>Select</option>
                          <option value="United States">United States</option>
                          <option value="India">India</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="China">China</option>
                          <option value="Europe">Europe</option>
                        </select>
                      </div>

                      <div className="myFormGroup form-group">
                        <label className="myInputLabel">Source Currency</label>
                        <select
                          className="form-control"
                          onChange={(e) => this.filterUpdate(e, "srcCurrency")}
                        >
                          <option value>Select</option>
                          {this.getCurrencies()}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label className="myInputLabel">Remit</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Start"
                            onChange={(e) =>
                              this.filterUpdate(e, "srcPriceStart")
                            }
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label className="myInputLabel">{"\u00A0"}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="End"
                            onChange={(e) =>
                              this.filterUpdate(e, "srcPriceEnd")
                            }
                          />
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: "20px" }}>
                      <div className="myFormGroup form-group">
                        <label className="myInputLabel">Target Country</label>
                        <select
                          className="form-control"
                          onChange={(e) => this.filterUpdate(e, "destCountry")}
                        >
                          <option value>Select</option>
                          <option value="United States">United States</option>
                          <option value="India">India</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="China">China</option>
                          <option value="Europe">Europe</option>
                        </select>
                      </div>

                      <div className="myFormGroup form-group">
                        <label className="myInputLabel">Target Currency</label>
                        <select
                          className="form-control"
                          onChange={(e) => this.filterUpdate(e, "destCurrency")}
                        >
                          <option value>Select</option>
                          {this.getCurrencies()}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group col-md-6">
                          <label className="myInputLabel">Price</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Start"
                            onChange={(e) =>
                              this.filterUpdate(e, "destPriceStart")
                            }
                          />
                        </div>

                        <div className="form-group col-md-6">
                          <label className="myInputLabel">{"\u00A0"}</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="End"
                            onChange={(e) =>
                              this.filterUpdate(e, "destPriceEnd")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-9" style={{ maxWidth: "900px" }}>

                  {/* <OfferComponent
                    postedBy="Vatsa Patel"
                    srcCountry="India"
                    srcCurrency="INR"
                    remitAmount="75,000"
                    destCurrency="USD"
                    destCountry="United States"
                    finalAmount="1000"
                  /> */}
                  {this.state.isLoading ? (
                    <div className="preloading">
                      <div id="preloader">
                        <div className="sk-three-bounce">
                          <div className="sk-child sk-bounce1" />
                          <div className="sk-child sk-bounce2" />
                          <div className="sk-child sk-bounce3" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Pagination
                      elementToRender={(e) => e}
                      elementsPerPage={10}
                      totalPages={totalPages}
                      handleNextPage={(page, pageSize) => {
                        const pageParsed = page - 1;
                        return items.slice(
                          pageParsed * pageSize,
                          (pageParsed + 1) * pageSize
                        );
                      }}
                    />
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
