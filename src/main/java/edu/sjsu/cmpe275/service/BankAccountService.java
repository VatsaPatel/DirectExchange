package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.dao.BankAccount;
import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.repository.BankAccountRepository;
import edu.sjsu.cmpe275.repository.UserRepository;
import edu.sjsu.cmpe275.representation.BankAccountCreateRepresentation;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
@Slf4j
public class BankAccountService {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserRepository userRepository;

    private static String regex = "^[0-9]+$";
    private static Pattern numericPattern = Pattern.compile(regex);

    public ResponseEntity<?> getUserAccounts(@NonNull long userId) {

        List<BankAccount> bankAccounts = bankAccountRepository.findByUserUserId(userId);
        if (bankAccounts == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User has not created a bank account yet");
        }
        return ResponseEntity.status(HttpStatus.OK).body(bankAccounts);
    }

    // at time of add, do a call to even change valid type
    public ResponseEntity<?> addAccount(@NonNull long userId, BankAccountCreateRepresentation newUserBankAccount) {

        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if(newUserBankAccount.getAccountNumber() == null || newUserBankAccount.getBankName() == null ||
                newUserBankAccount.getCountry() == null || newUserBankAccount.getFeatures() == null ||
                newUserBankAccount.getOwnerAddress()== null || newUserBankAccount.getOwnerName()== null ||
                newUserBankAccount.getPrimaryCurrency()== null ||
        newUserBankAccount.getAccountNumber().trim().isEmpty() || newUserBankAccount.getBankName().trim().isEmpty() ||
        newUserBankAccount.getCountry().trim().isEmpty() || newUserBankAccount.getFeatures().trim().isEmpty() ||
        newUserBankAccount.getOwnerAddress().trim().isEmpty() || newUserBankAccount.getOwnerName().trim().isEmpty() ||
        newUserBankAccount.getPrimaryCurrency().trim().isEmpty() ) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please provide all fields");
        }

        if (!numericPattern.matcher(newUserBankAccount.getAccountNumber()).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Account Number should be Numeric");
        }

        BankAccount newBankAccount = new BankAccount();
        newBankAccount.setAccountNumber(newUserBankAccount.getAccountNumber());
        newBankAccount.setBankName(newUserBankAccount.getBankName());
        newBankAccount.setCountry(newUserBankAccount.getCountry());
        newBankAccount.setFeatures(newUserBankAccount.getFeatures());
        newBankAccount.setOwnerAddress(newUserBankAccount.getOwnerAddress());
        newBankAccount.setOwnerName(newUserBankAccount.getOwnerName());
        newBankAccount.setPrimaryCurrency(newUserBankAccount.getPrimaryCurrency());
        newBankAccount.setUser(user);

        bankAccountRepository.save(newBankAccount);

        List<BankAccount> accounts = bankAccountRepository.findByUserUserId(userId);
        for ( BankAccount account : accounts ) {
            if(!account.getCountry().equalsIgnoreCase(newUserBankAccount.getCountry())) {
                user.setValidUser(true);
                userRepository.save(user);
            }
        }
        return ResponseEntity.status(HttpStatus.OK).body(newBankAccount);
    }

}
