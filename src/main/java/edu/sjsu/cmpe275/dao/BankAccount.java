package edu.sjsu.cmpe275.dao;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import lombok.Data;
import lombok.NonNull;
import lombok.ToString;

import javax.persistence.*;

/*
 * Bank Account Entity - maps to the bank_account table
 */
@Data
@Entity
@Table(name = "bank_account")
public class BankAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long bankAccountId;

    @ManyToOne
    @JoinColumn(name = "userId",  nullable = false)
    @ToString.Exclude
    private User user;

    @Column(name="bankName", nullable = false)
    private String bankName;

    @Column(name="accountNumber", nullable = false)
    private String accountNumber;

    @Column(name="ownerName", nullable = false)
    private String ownerName;

    @Column(name="ownerAddress", nullable = false)
    private String ownerAddress;

    @Column(name="primaryCurrency", nullable = false)
    private String primaryCurrency;

    @Column(name="country", nullable = false)
    private String country;

    @Column(name="features", nullable = false)
    private String features;
}