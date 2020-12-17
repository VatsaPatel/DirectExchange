package edu.sjsu.cmpe275.representation;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

@Data
@NoArgsConstructor
public class BankAccountCreateRepresentation {

    private String bankName;
    private String accountNumber;
    private String ownerName;
    private String ownerAddress;
    private String primaryCurrency;
    private String country;
    private String features;

}

