package edu.sjsu.cmpe275.dao;


import com.fasterxml.jackson.annotation.JsonIgnore;
import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import lombok.Data;
import lombok.ToString;

import javax.persistence.*;

/*
 * Exchange Offer Entity - maps to the exchange_offer table
 */
@Data
@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private long userId;

    @Column(name="username", nullable = false, unique = true)
    private String emailId;

    @Column(name="nickname", nullable = false, unique = true)
    private String nickName;

    @Column(name="password", nullable = true)
    @ToString.Exclude
    @JsonIgnore
    private String password;

    @Column(name="registrationType", nullable = false)
    private RegistrationType registrationType;

    @Column(name="emailVerified", columnDefinition = "boolean default 0", nullable = false)
    private Boolean emailVerified;

    @JsonIgnore
    @ToString.Exclude
    @Column(name = "emailVerificationCode", nullable = false, unique = true)
    private String emailVerificationCode;

    @JsonIgnore
    @Column(name = "validUser", columnDefinition = "boolean default 0", nullable = false)
    private Boolean validUser;

    @Column(name="rating", columnDefinition = "int default 0")
    private Integer rating;
}


