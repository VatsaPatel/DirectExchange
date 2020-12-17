package edu.sjsu.cmpe275.controller;

import edu.sjsu.cmpe275.representation.BankAccountCreateRepresentation;
import edu.sjsu.cmpe275.service.BankAccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/bank-accounts")
@CrossOrigin
public class BankAccountController {

    @Autowired
    private BankAccountService bankAccountService;

    @PreAuthorize("#userId.toString() == authentication.principal")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserBankAccount(@PathVariable("userId") Long userId) {
        return bankAccountService.getUserAccounts(userId);
    }

    @PreAuthorize("#userId.toString() == authentication.principal")
    @PostMapping(value = "/{userId}", produces = {"application/json"})
    public ResponseEntity<?> updateUser(@PathVariable("userId") Long userId,
                                        @RequestBody BankAccountCreateRepresentation bankaccount) {
//        String nickName = (String)updateUser.get("nickName");
        return bankAccountService.addAccount(userId, bankaccount);
    }
}
