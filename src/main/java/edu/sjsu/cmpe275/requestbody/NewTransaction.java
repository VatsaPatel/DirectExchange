package edu.sjsu.cmpe275.requestbody;

import java.util.List;

public class NewTransaction {

    Long source_offer;

    List<Long> offers_matched;

    float source_offer_amount;

    public Long getSource_offer() {
        return source_offer;
    }

    public void setSource_offer(Long source_offer) {
        this.source_offer = source_offer;
    }

    public List<Long> getOffers_matched() {
        return offers_matched;
    }

    public void setOffers_matched(List<Long> offers_matched) {
        this.offers_matched = offers_matched;
    }

    public float getSource_offer_amount() {
        return source_offer_amount;
    }

    public void setSource_offer_amount(float source_offer_amount) {
        this.source_offer_amount = source_offer_amount;
    }
}
