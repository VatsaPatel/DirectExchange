package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.repository.ExchangeOfferRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class ExchangeOfferService {

  Logger log = LoggerFactory.getLogger(ExchangeOfferService.class);
  @Autowired
  private ExchangeOfferRepository exchangeOfferRepository;

  /**
   * @param status
   * @param singleMatches
   * @param splitMatches
   * @return ResponseEntity Object
   * This method generates the json output in desired format - message, status and timestamp
   */
  public ResponseEntity<Object> generateResponse(HttpStatus status, List<ExchangeOffer> singleMatches, List<List<ExchangeOffer>> splitMatches, List<List<ExchangeOffer>> otherSplitMatches) {
    Map<String, Object> response = new HashMap<>();
    log.info("generate response:");
    try {
      response.put("status", status.value());
      response.put("singleMatches", singleMatches);
      response.put("splitMatches", splitMatches);
      response.put("otherSplitMatches", otherSplitMatches);
      return new ResponseEntity<Object>(response, status);
    } catch (Exception e) {
      response.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
      response.put("singleMatches", null);
      response.put("splitMatches", null);
      response.put("otherSplitMatches", null);
      return new ResponseEntity<Object>(response, status);
    }
  }

  public ResponseEntity<?> getOffersByOthers(Long userId) {
    try {
      List<ExchangeOffer> exchangeOffersList = exchangeOfferRepository.getOffersByOthers(userId);
      if (exchangeOffersList == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No offers yet!");
      }
      return ResponseEntity.status(HttpStatus.OK).body(exchangeOffersList);
    } catch (Exception exception) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
    }
  }

  public ResponseEntity<?> getMyOffers(Long userId) {
    try {
      List<ExchangeOffer> exchangeOffersList = exchangeOfferRepository.findByUserId(userId);

      if (exchangeOffersList == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You haven't posted any offers yet!");
      }
      return ResponseEntity.status(HttpStatus.OK).body(exchangeOffersList);
    } catch (Exception exception) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
    }
  }

//Expiration date check - time zone??

  public ResponseEntity<?> getSingleMatches(Long userId, Integer remitAmount, String srcCurrency, String destCurrency) {
    try {
      List<ExchangeOffer> exchangeOffersList = exchangeOfferRepository.findSingleMatches(userId, remitAmount, srcCurrency, destCurrency); //LocalDate.now()

      if (exchangeOffersList == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("You haven't posted any offers yet!");
      }
      return ResponseEntity.status(HttpStatus.OK).body(exchangeOffersList);
    } catch (Exception exception) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
    }
  }


  public ResponseEntity<?> getAllMatches(Long userId, Integer remitAmount, String srcCurrency, String destCurrency) {

    try {
      List<ExchangeOffer> singleMatches = exchangeOfferRepository.findSingleMatches(userId, remitAmount, srcCurrency, destCurrency); //LocalDate.now()
      log.info("srcCurrency: ", srcCurrency);

      List<ExchangeOffer> exchangeOffersList = exchangeOfferRepository.getOffersBySrcCurrency(userId, srcCurrency, destCurrency);

      log.info("exchangeOffersList: ", exchangeOffersList);

      List<List<ExchangeOffer>> splitMatches = fetchSplitMatches(exchangeOffersList, remitAmount);

      List<List<ExchangeOffer>> otherSplitMatches = fetchOtherSplitMatches(exchangeOffersList, remitAmount);

      return generateResponse(HttpStatus.OK, singleMatches, splitMatches, otherSplitMatches);

    } catch (Exception exception) {
      return generateResponse(HttpStatus.INTERNAL_SERVER_ERROR, null, null, null);
    }
  }


  public List<List<ExchangeOffer>> fetchSplitMatches(List<ExchangeOffer> exchangeOffersList, Integer remitAmount) {
    List<List<ExchangeOffer>> splitMatches = new ArrayList<>();

    List<List<ExchangeOffer>> generateSubsets = generateSubsets(exchangeOffersList);
    int counter = 1;

    for (List<ExchangeOffer> subset : generateSubsets) {
      if (subset.size() == 2) {
        float sum = subset.get(0).getRemitAmount() + subset.get(1).getRemitAmount();
        if ((sum >= remitAmount * 0.9 && sum <= remitAmount * 1.1)) {
          splitMatches.add(subset);
          counter++;
        }
      }
    }
    return splitMatches;
  }

  public List<List<ExchangeOffer>> fetchOtherSplitMatches(List<ExchangeOffer> exchangeOffersList, Integer remitAmount) {
    List<List<ExchangeOffer>> splitMatches = new ArrayList<>();

    List<List<ExchangeOffer>> generateSubsets = generateSubsets(exchangeOffersList);
    int counter = 1;

    for (List<ExchangeOffer> subset : generateSubsets) {
      if (subset.size() == 2) {
        float diff = Math.abs(subset.get(0).getRemitAmount() - subset.get(1).getRemitAmount());
        if (diff >= remitAmount * 0.9 && diff <= remitAmount * 1.1) {
          splitMatches.add(subset);
          counter++;
        }
      }
    }
    return splitMatches;
  }

  public List<List<ExchangeOffer>> generateSubsets(List<ExchangeOffer> exchangeOffersList) {

    List<List<ExchangeOffer>> subsets = new ArrayList();
    subsets.add(new ArrayList<>());

    for (ExchangeOffer exchangeOffer : exchangeOffersList) {

      List<List<ExchangeOffer>> newSubsets = new ArrayList<>();
      for (List<ExchangeOffer> subset : subsets) {
        newSubsets.add(new ArrayList<ExchangeOffer>(subset) {{
          add(exchangeOffer);
        }});
      }

      for (List<ExchangeOffer> subset1 : newSubsets) {
        subsets.add(subset1);
      }
    }

    return subsets;
  }
}
