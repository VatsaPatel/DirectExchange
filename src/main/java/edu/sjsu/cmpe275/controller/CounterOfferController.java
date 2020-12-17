package edu.sjsu.cmpe275.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.service.AuthorizationService;
import edu.sjsu.cmpe275.service.CounterOfferService;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;


@RestController
  @CrossOrigin
  @RequestMapping("user/counteroffer")
  @Slf4j
  public class CounterOfferController {

  @Autowired
  private CounterOfferService counterOfferService;

  @Autowired
  private AuthorizationService authorizationService;


  Logger log = LoggerFactory.getLogger(CounterOfferController.class);

  //    @PreAuthorize("#userId == authentication.principal")
  @PostMapping(produces = {MediaType.APPLICATION_JSON_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<?> postCounterOffers(@RequestBody JSONObject object) {

    ObjectMapper mapper = new ObjectMapper();
    try {

      HashMap<String, String> senderMap = (HashMap<String, String>) object.get("senderOffer");
      String senderO = new Gson().toJson(senderMap, Map.class);
      ExchangeOffer senderOffer = new Gson().fromJson(senderO, ExchangeOffer.class);
      log.info("senderOffer value: {}", senderOffer);

      HashMap<String, String> receiverMap = (HashMap<String, String>) object.get("receiverOffer");
      String receiverO = new Gson().toJson(receiverMap, Map.class);
      ExchangeOffer receiverOffer = new Gson().fromJson(receiverO, ExchangeOffer.class);
      log.info("receiverOffer value: {}", receiverOffer);

      Integer counterOfferAmount = Integer.parseInt((String) object.get("counter_offer_amount"));
      String type = (String) object.get("type");

      log.info("counterOfferAmount value: {}", counterOfferAmount);

      return counterOfferService.postCounterOffer(senderOffer, receiverOffer, null, counterOfferAmount, type);
    } catch (Exception e) {
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldnt post offer, try after soemtime");
    }
  }


  //    @PreAuthorize("#userId == authentication.principal")
    @PostMapping(value="/split", produces = {MediaType.APPLICATION_JSON_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> postSplitCounterOffers(@RequestBody JSONObject object) {

    ObjectMapper mapper = new ObjectMapper();
    try {

      HashMap<String, String> senderMap = (HashMap<String, String>) object.get("senderOffer");
      String senderO = new Gson().toJson(senderMap, Map.class);
      ExchangeOffer senderOffer = new Gson().fromJson(senderO, ExchangeOffer.class);
      log.info("senderOffer value: {}", senderOffer);

      HashMap<String, String> receiverMap = (HashMap<String, String>) object.get("receiverOffer");
      String receiverO = new Gson().toJson(receiverMap, Map.class);
      ExchangeOffer receiverOffer = new Gson().fromJson(receiverO, ExchangeOffer.class);
      log.info("receiverOffer value: {}", receiverOffer);

      HashMap<String, String> thirdPartyMap = (HashMap<String, String>) object.get("thirdParty");
      String thirdPartyO = new Gson().toJson(thirdPartyMap, Map.class);
      ExchangeOffer thirdPartyOffer = new Gson().fromJson(thirdPartyO, ExchangeOffer.class);
      log.info("receiverOffer value: {}", thirdPartyOffer);


      Integer counterOfferAmount = Integer.parseInt(String.valueOf(object.get("counter_offer_amount")));
      String type = String.valueOf(object.get("type"));

      log.info("counterOfferAmount value: {}", counterOfferAmount);

      return counterOfferService.postCounterOffer(senderOffer, receiverOffer, thirdPartyOffer, counterOfferAmount, type);
    } catch (Exception e) {
      log.info("Exception e: ", e);
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldnt post offer, try after soemtime");
    }
  }


//  @PreAuthorize("#userId == authentication.principal")
  @GetMapping(value = "/{id}", produces = {"application/json"})
  public ResponseEntity<?> getCounterOffers(@PathVariable(value = "id") String user_id) {

    Long userId = Long.parseLong(user_id);
    return counterOfferService.getCounterOffers(userId);
  }


  @PutMapping(produces = {MediaType.APPLICATION_JSON_VALUE}, consumes = {MediaType.APPLICATION_JSON_VALUE})
  public ResponseEntity<?> rejectCounterOffers(@RequestBody JSONObject object) {

    try {
      Long counterOfferId = Long.parseLong(String.valueOf(object.get("counterOfferId")));
      Long senderInitialOfferId = Long.parseLong(String.valueOf(object.get("senderInitialOfferId")));

      String rejectMsgFromUser = String.valueOf(object.get("rejectMsgFromUser"));
      String rejectMsgToEmail = String.valueOf(object.get("rejectMsgToEmail"));

      return counterOfferService.rejectCounterOffer(counterOfferId, senderInitialOfferId, rejectMsgFromUser, rejectMsgToEmail);
    }catch(Exception e){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldnt reject offer, try after soemtime");
    }

  }
}