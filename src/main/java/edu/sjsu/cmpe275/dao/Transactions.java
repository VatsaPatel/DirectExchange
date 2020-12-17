package edu.sjsu.cmpe275.dao;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.time.ZonedDateTime;


@Entity
@Table(name="transactions")
public class Transactions {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name="user_id", nullable = false)
    private long userId;

    @ManyToOne
    @JoinColumn(name = "offerid")
    private ExchangeOffer offerid;

    @Column(name="is_complete", columnDefinition = "int default false")
    int is_complete;

    @Column(name="transaction_status")
    String transactionStatus ="pending";

    @Column(name="expiration_date")
    ZonedDateTime expirationDate;


    @Column(name = "remit_account_id")
    private Long remit_account_id;

    @Column(name = "dest_account_id")
    private Long dest_account_id;

    @Column(name="transaction_remit_amount")
    private double transaction_remit_amount;

    public Transactions() {
    }
    public Transactions(String transactionId, ExchangeOffer offerid, long userid, ZonedDateTime expirationDate, Double transactionRemitAmount){
        this.transactionId=transactionId;
        this.offerid=offerid;
        this.userId=userid;
        this.expirationDate=expirationDate;
        this.transaction_remit_amount= transactionRemitAmount;
    }

    public Transactions(String transactionId, ExchangeOffer offerid){
        this.transactionId=transactionId;
        this.offerid=offerid;
    }

    public ZonedDateTime getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(ZonedDateTime expirationDate) {
        this.expirationDate = expirationDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public ExchangeOffer getOfferDetails() {
        return offerid;
    }

    public void setOfferDetails(ExchangeOffer offerid) {
        this.offerid = offerid;
    }

    public int getIs_complete() {
        return is_complete;
    }

    public void setIs_complete(int is_complete) {
        this.is_complete = is_complete;
    }

    public String getTransactionStatus() {
        return transactionStatus;
    }

    public void setTransactionStatus(String transactionStatus) {
        this.transactionStatus = transactionStatus;
    }

    public Long getRemit_account_id() {
        return remit_account_id;
    }

    public void setRemit_account_id(Long remit_account_id) {
        this.remit_account_id = remit_account_id;
    }

    public Long getDest_account_id() {
        return dest_account_id;
    }

    public void setDest_account_id(Long dest_account_id) {
        this.dest_account_id = dest_account_id;
    }

    public double getTransaction_remit_amount() {
        return transaction_remit_amount;
    }

    public void setTransaction_remit_amount(double transaction_remit_amount) {
        this.transaction_remit_amount = transaction_remit_amount;
    }

    @Override
    public String toString() {
        return "Transactions{" +
            "id=" + id +
            ", transactionId='" + transactionId + '\'' +
            ", userId=" + userId +
            ", offerid=" + offerid +
            ", is_complete=" + is_complete +
            ", transactionStatus='" + transactionStatus + '\'' +
            ", expirationDate=" + expirationDate +
            ", remit_account_id=" + remit_account_id +
            ", dest_account_id=" + dest_account_id +
            ", transaction_remit_amount=" + transaction_remit_amount +
            '}';
    }
}
