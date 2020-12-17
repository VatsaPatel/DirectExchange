package edu.sjsu.cmpe275.aspect;

import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.dao.Transactions;
import edu.sjsu.cmpe275.repository.ExchangeOfferRepository;
import edu.sjsu.cmpe275.repository.TransactionsRepository;
import edu.sjsu.cmpe275.repository.UserRepository;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.After;
import org.aspectj.lang.annotation.Aspect;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Aspect
@Component
public class ReputationAdvice {

  private static Logger log = LoggerFactory.getLogger(LoggingAdvice.class);

  @Autowired
  ExchangeOfferRepository exchangeOfferRepository;

  @Autowired
  TransactionsRepository transactionsRepository;

  @Autowired
  UserRepository userRepository;

  @After("execution(* edu.sjsu.cmpe275.service.TransactionService.updateTransaction(..))")
  public void reputation(JoinPoint joinPoint) throws Throwable {
    log.info("***************************************************inside reputation advice***************************************************");

    double totalTransactions = 0;
    double totalAtFaultTransactions = 0;

    Long offer_id = (Long) joinPoint.getArgs()[0];

    ExchangeOffer exchangeOffer = exchangeOfferRepository.findOfferDetailById(offer_id);
    Long userId = exchangeOffer.getUser().getUserId();

    List<Transactions> allTransactions = transactionsRepository.fetchTransactionsWithUserId(userId);
    totalTransactions = allTransactions.size();

    for(Transactions transactions : allTransactions){
      if(transactions.getIs_complete() == 0 && ("aborted").equals(transactions.getTransactionStatus())){
        totalAtFaultTransactions++;
      }
    }

    if(totalTransactions > 0) {
      Integer rating = Math.toIntExact(Math.round(((1 - (totalAtFaultTransactions/totalTransactions)) * 4) + 1));
      log.info("*****************************************************************: userId:::{} ---- totalTransactions:::{} ----- totalAtFaultTransactions:::{} ------ rating:::{}", userId, totalTransactions, totalAtFaultTransactions, rating);
      userRepository.updateUserRating(userId, rating);
    }
  }

  @After("execution(* edu.sjsu.cmpe275.service.TransactionService.getTransactions(..))")
  public void reputationAfterGet(JoinPoint joinPoint) throws Throwable {
    log.info("***************************************************inside reputation advice***************************************************");

    double totalTransactions = 0;
    double totalAtFaultTransactions = 0;

    Long userId = (Long) joinPoint.getArgs()[0];

    List<Transactions> allTransactions = transactionsRepository.fetchTransactionsWithUserId(userId);
    totalTransactions = allTransactions.size();

    for(Transactions transactions : allTransactions){
      if(transactions.getIs_complete() == 0 && ("aborted").equals(transactions.getTransactionStatus())){
        totalAtFaultTransactions++;
      }
    }

    if(totalTransactions > 0) {
      Integer rating = Math.toIntExact(Math.round(((1 - (totalAtFaultTransactions/totalTransactions)) * 4) + 1));
      log.info("*****************************************************************: userId:::{} ---- totalTransactions:::{} ----- totalAtFaultTransactions:::{} ------ rating:::{}", userId, totalTransactions, totalAtFaultTransactions, rating);
      userRepository.updateUserRating(userId, rating);
    }
  }

}
