package edu.sjsu.cmpe275.requestbody;

import java.util.Date;

public class PostOffer {

    private float amount;
    private double exchange_rate;
    private String source_currency;
    private String source_country;
    private String destination_currency;
    private String destination_country;
    private Date expirationdate;
    private Boolean allowCounterOffers;
    private Boolean allowOfferSplit;

    public float getAmount() {
        return amount;
    }

    public void setAmount(float amount) {
        this.amount = amount;
    }

    public double getExchange_rate() {
        return exchange_rate;
    }

    public void setExchange_rate(double exchange_rate) {
        this.exchange_rate = exchange_rate;
    }

    public String getSource_currency() {
        return source_currency;
    }

    public void setSource_currency(String source_currency) {
        this.source_currency = source_currency;
    }

    public String getSource_country() {
        return source_country;
    }

    public void setSource_country(String source_country) {
        this.source_country = source_country;
    }

    public String getDestination_currency() {
        return destination_currency;
    }

    public void setDestination_currency(String destination_currency) {
        this.destination_currency = destination_currency;
    }

    public String getDestination_country() {
        return destination_country;
    }

    public void setDestination_country(String destination_country) {
        this.destination_country = destination_country;
    }

    public Date getExpirationdate() {
        return expirationdate;
    }

    public void setExpirationdate(Date expirationdate) {
        this.expirationdate = expirationdate;
    }

    public Boolean getAllowCounterOffers() {
        return allowCounterOffers;
    }

    public void setAllowCounterOffers(Boolean allowCounterOffers) {
        this.allowCounterOffers = allowCounterOffers;
    }

    public Boolean getAllowOfferSplit() {
        return allowOfferSplit;
    }

    public void setAllowOfferSplit(Boolean allowOfferSplit) {
        this.allowOfferSplit = allowOfferSplit;
    }
}
