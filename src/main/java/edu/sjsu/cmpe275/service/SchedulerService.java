package edu.sjsu.cmpe275.service;
import java.text.SimpleDateFormat;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.Queue;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class SchedulerService {

    private static final Logger log = LoggerFactory.getLogger(SchedulerService.class);

    private static final SimpleDateFormat dateFormat = new SimpleDateFormat("HH:mm:ss");

    private Queue<ArrayList<Object>> queue = new LinkedList<>();

    private Queue<ArrayList<Object>> counterQueue = new LinkedList<>();

    @Autowired
    public TransactionService transactionService;

    @Autowired
    public CounterOfferService counterOfferService;

    public void addNewTransaction(String transaction_id, ZonedDateTime expirationDate){
        System.out.println("In add new transaction");
        ArrayList<Object> arrayItems = new ArrayList<Object>();
        arrayItems.add(transaction_id);
        arrayItems.add(expirationDate);
        queue.add(arrayItems);
    }

    @Scheduled(fixedRate = 15000)
    public void reportCurrentTime() {
        ZonedDateTime currentDateTime = ZonedDateTime.now(ZoneOffset.UTC);
        log.info("The time is {}", currentDateTime);
        if(queue.size()>0 && currentDateTime.toInstant().compareTo(((ZonedDateTime) queue.peek().get(1)).toInstant())>0){
            log.info("Setting at fault transactions");
            transactionService.setAtFaultTransactions((String) queue.peek().get(0));
            queue.remove();
        }
    }

    public void addNewCounter(Long counterOfferId, ZonedDateTime expirationDate){
        System.out.println("In addNewCounter");
        ArrayList<Object> arrayItems = new ArrayList<Object>();
        arrayItems.add(counterOfferId);
        arrayItems.add(expirationDate);
        counterQueue.add(arrayItems);
    }

    @Scheduled(fixedRate = 30000)
    public void reportCounterExpiration() {
        ZonedDateTime currentDateTime = ZonedDateTime.now(ZoneOffset.UTC);
        log.info("Counter schedular - time is {}", currentDateTime);
        log.info("counter offer queue size: {}", counterQueue.size());
        if(counterQueue.size()>0 && currentDateTime.toInstant().compareTo(((ZonedDateTime) counterQueue.peek().get(1)).toInstant())>0){
            log.info("Setting expired status to counter offers");
            counterOfferService.setExpirationToCounterOffers((Long) counterQueue.peek().get(0));
            counterQueue.remove();
        }
    }
}
