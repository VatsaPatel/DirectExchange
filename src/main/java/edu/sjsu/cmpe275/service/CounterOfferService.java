package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.dao.CounterOffer;
import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.dao.Transactions;
import edu.sjsu.cmpe275.repository.CounterOfferRepository;
import edu.sjsu.cmpe275.repository.ExchangeOfferRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class CounterOfferService {

  Logger log = LoggerFactory.getLogger(CounterOfferService.class);

  @Autowired
  private CounterOfferRepository counterOfferRepository;

  @Autowired
  private ExchangeOfferRepository exchangeOfferRepository;

  @Autowired
  private EmailService emailService;

  @Autowired
  private SchedulerService schedulerService;

  /**
   * @param status
   * @param mycounterOffers
   * @param counterOffersForMe
   * @return ResponseEntity Object
   * This method generates the json output in desired format - message, status and timestamp
   */
  public ResponseEntity<Object> generateResponse(HttpStatus status, List<CounterOffer> mycounterOffers, List<CounterOffer> counterOffersForMe) {
    Map<String, Object> response = new HashMap<>();
    log.info("generate response:");
    try {
      response.put("status", status.value());
      response.put("mycounterOffers", mycounterOffers);
      response.put("counterOffersForMe", counterOffersForMe);
      return new ResponseEntity<Object>(response, status);
    } catch (Exception e) {
      response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
      response.put("mycounterOffers", null);
      response.put("counterOffersForMe", null);
      return new ResponseEntity<Object>(response, status);
    }
  }

  public ResponseEntity<?> postCounterOffer(ExchangeOffer senderOffer, ExchangeOffer receiverOffer, ExchangeOffer thirdPartyOffer, Integer counterOfferAmount, String type) {

    try {

//      Date timeNow = new Date(System.currentTimeMillis() + TimeUnit.MINUTES.toMillis(5));

      ZonedDateTime timeNow = ZonedDateTime.now(ZoneOffset.UTC).plusMinutes(5);
      log.info("time now: ", System.currentTimeMillis(), "---", timeNow);

      CounterOffer counterOffer = new CounterOffer();

      counterOffer.setSenderOffer(senderOffer);
      counterOffer.setReceiverOffer(receiverOffer);
      counterOffer.setCounterOfferAmount(counterOfferAmount);
      counterOffer.setStatus("new");
      counterOffer.setExpirationDate(timeNow);
      counterOffer.setSender(senderOffer.getUser());
      counterOffer.setReceiver(receiverOffer.getUser());
      counterOffer.setType(type);

      if( type.equals("split")){
        counterOffer.setThirdPartyOffer(thirdPartyOffer);
      }

      counterOfferRepository.save(counterOffer);
      CounterOffer newCounterOffer = counterOfferRepository.saveAndFlush(counterOffer);
      log.info("new counter offer details: {}", newCounterOffer.toString());
      log.info("new counter offer atleast id: {}", newCounterOffer.getOfferId());
      schedulerService.addNewCounter(newCounterOffer.getOfferId(), timeNow);

      ExchangeOffer eo = exchangeOfferRepository.findByofferId(senderOffer.getOfferId());
      eo.setStatus("CounterMade");

      exchangeOfferRepository.save(eo);
      emailService.sendCounterOfferEmail(senderOffer.getUser().getNickName(), receiverOffer.getUser().getEmailId(), receiverOffer.getUser().getNickName(), receiverOffer.getSrcCurrency(), receiverOffer.getRemitAmount());

      return ResponseEntity.status(HttpStatus.OK).body("Counter offer sent successfully");

    }catch(Exception e){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldn't post counter offer. Try after sometime.");
    }
  }


  public ResponseEntity<?> getCounterOffers(Long userId) {

    try {

      List<CounterOffer> mycounterOffers = counterOfferRepository.getMyCounterOffers(userId);
      List<CounterOffer> counterOffersForMe = counterOfferRepository.getCounterOffersForMe(userId);

      return generateResponse(HttpStatus.OK, mycounterOffers, counterOffersForMe);

    } catch (Exception exception) {
      return generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, null);
    }
  }


  public ResponseEntity<?> rejectCounterOffer(Long counterOfferId, Long senderInitialOfferId, String rejectMsgFromUser, String rejectMsgToEmail){
    try {
        counterOfferRepository.updateCounterOfferStatus(counterOfferId, "rejected");
        exchangeOfferRepository.updateExchangeOfferStatus(senderInitialOfferId, "Open");
        emailService.sendRejectCounterOfferEmail(rejectMsgFromUser, rejectMsgToEmail);

        return ResponseEntity.status(HttpStatus.OK).body("Counter offer rejected successfully");
    }
    catch(Exception exception){
      return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Couldn't reject counter offer. Try after sometime.");
    }

  }


  public void setExpirationToCounterOffers(Long counterOfferId){

    try{
      log.info("*************************************************************inside setExpirationToCounterOffers");
      int updated = counterOfferRepository.updateExpiredStatus("expired",counterOfferId);
      System.out.println("Updated "+updated+"\n\n\n");
      if(updated!=0){
        CounterOffer counterOffer = counterOfferRepository.getCounterOfferDetailById(counterOfferId);

        log.info("resetting the status of the exchange offer: {} ", counterOffer.getSenderOffer().getOfferId());
        exchangeOfferRepository.resetOfferStatusOfOne(counterOffer.getSenderOffer().getOfferId(),"Open");
      }

    }catch(Exception e){
      System.out.println("Error "+e.getMessage());
    }

  }
}