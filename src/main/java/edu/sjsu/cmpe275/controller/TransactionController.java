package edu.sjsu.cmpe275.controller;

import com.google.gson.Gson;
import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.service.TransactionService;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;


@RestController
@CrossOrigin
@RequestMapping("api/transactions")
@Slf4j
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    Logger log = LoggerFactory.getLogger(TransactionController.class);

    @PreAuthorize("#userId == authentication.principal")
    @PostMapping(value = "/{id}", produces = {"application/json"})
    public ResponseEntity createNewTransaction(@PathVariable(value = "id") String userId,
                                               @RequestBody JSONObject object) {

        HashMap<String, String> offerMatched1 = (HashMap<String, String>) object.get("offers_matched1");
        String offer1 = new Gson().toJson(offerMatched1, Map.class);
        ExchangeOffer offerMatch1 = new Gson().fromJson(offer1, ExchangeOffer.class);
        List<Long> offersMatched = new ArrayList<>();
        offersMatched.add(offerMatch1.getOfferId());

        HashMap<String, String> offerMatched2 = (HashMap<String, String>) object.get("offers_matched2");
        if(offerMatched2 != null && offerMatched2.size() != 0){
            String offer2 = new Gson().toJson(offerMatched2, Map.class);
            ExchangeOffer offerMatch2 = new Gson().fromJson(offer2, ExchangeOffer.class);
            offersMatched.add(offerMatch2.getOfferId());
        }

        Long sourceOffer = Long.parseLong(String.valueOf(object.get("source_offer")));
        Float sourceOfferAmount = Float.parseFloat(String.valueOf(object.get("source_offer_amount")));
        Long counterOfferId = Long.parseLong(String.valueOf(object.get("counterOfferId")));
        log.info("offersMatched value: {}", offersMatched);

        return transactionService.createNewTransaction(sourceOffer, offersMatched, sourceOfferAmount, counterOfferId);
    }


    @PreAuthorize("#userId == authentication.principal")
    @PutMapping(value = "/{id}", produces = {"application/json"})
    public ResponseEntity updateTransaction(@PathVariable(value = "id") String userId,
                                            @RequestParam(name = "offer_id")  Long offer_id,
                                            @RequestParam(name = "transaction_id") String transaction_id,
                                            @RequestParam(name = "remit_accountid") Long remit_accountid,
                                            @RequestParam(name = "destination_accountid") Long destination_accountid
                                            ){



        return transactionService.updateTransaction(offer_id,transaction_id,remit_accountid,destination_accountid);

    }

    @PreAuthorize("#userId == authentication.principal")
    @GetMapping(value = "/{id}", produces = {"application/json"})
    public ResponseEntity getTransactions(@PathVariable(name="id") String userId ){

        System.out.println("Transaction "+userId);
        return transactionService.getTransactions(Long.parseLong(userId));
    }

    @PreAuthorize("#userId == authentication.principal")
    @GetMapping(value = "/systemreport/{id}", produces = {"application/json"})
    public ResponseEntity getSystemReport(@PathVariable(name="id") String userId ){

        return transactionService.getSystemReport();
    }

//    @PreAuthorize("#userId == authentication.principal")
    @GetMapping(value = "/history/{id}", produces = {"application/json"})
    public ResponseEntity getTransactionHistory(@PathVariable(name="id") String userId ){

//        System.out.println("Transaction History: "+userId);
        return transactionService.getTransactionHistory(Long.parseLong(userId));
    }
}
