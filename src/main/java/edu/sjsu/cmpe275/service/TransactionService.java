package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.controller.TransactionController;
import edu.sjsu.cmpe275.dao.BankAccount;
import edu.sjsu.cmpe275.dao.ExchangeOffer;
import edu.sjsu.cmpe275.dao.Transactions;
import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.repository.BankAccountRepository;
import edu.sjsu.cmpe275.repository.CounterOfferRepository;
import edu.sjsu.cmpe275.repository.ExchangeOfferRepository;
import edu.sjsu.cmpe275.repository.TransactionsRepository;
import edu.sjsu.cmpe275.repository.UserRepository;
import org.hibernate.Transaction;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import javax.transaction.Transactional;
import java.util.*;

@Service
@Transactional
public class TransactionService {

    @Autowired
    private TransactionsRepository transactionsRepository;

    @Autowired
    private ExchangeOfferRepository exchangeOfferRepository;

    @Autowired
    private CounterOfferRepository counterOfferRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SchedulerService schedulerService;

    private HashMap<String,Double> exchangeRate = new HashMap<String,Double>();

    Logger log = LoggerFactory.getLogger(TransactionService.class);

    public TransactionService(){
        exchangeRate.put("GBP",1.33);
        exchangeRate.put("USD",1.0);
        exchangeRate.put("EUR",1.21);
        exchangeRate.put("INR",0.01351351351);
        exchangeRate.put("RMB",0.15243902439);

    }


    public ResponseEntity createNewTransaction(Long source_offer_id,
                                               List<Long> offer_matched, float amount, Long counterOfferId){

        try {
            ExchangeOffer sourceOffer = exchangeOfferRepository.findByOfferIdAndStatus(source_offer_id,"Open");

            if (sourceOffer == null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Your offer has already been completed!");
            }

            List<ExchangeOffer> otheroffers = exchangeOfferRepository.getOffersDetails(offer_matched);
            if (otheroffers.size() != offer_matched.size()) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Other offers are not longer open!");
            }

            sourceOffer.setRemitAmount(amount);
            float finalAmount = Math.round(amount * (float)sourceOffer.getExchangeRate()*100)/100;
            sourceOffer.setFinalAmount(finalAmount);
            sourceOffer.setStatus("InTransaction");

            String trans_id = UUID.randomUUID().toString();

            ZonedDateTime expirationDate = ZonedDateTime.now(ZoneOffset.UTC).plusMinutes(10);
            double transaction_amount =sourceOffer.getRemitAmount()*exchangeRate.get(sourceOffer.getSrcCurrency());
            double transaction_remit_amount = Math.round(transaction_amount*100)/100;

            Transactions newTransaction = new Transactions(trans_id, sourceOffer, sourceOffer.getUser().getUserId(),expirationDate,transaction_remit_amount);
            transactionsRepository.save(newTransaction);
            schedulerService.addNewTransaction(newTransaction.getTransactionId(),expirationDate);

            if(counterOfferId != -1){
                log.info("*************Going to change the counter offer status to accepted*************");
                counterOfferRepository.updateCounterOfferStatus(counterOfferId, "accepted");
            }

            for (ExchangeOffer offer : otheroffers) {
                transaction_amount = offer.getRemitAmount()*exchangeRate.get(offer.getSrcCurrency());
                transaction_remit_amount = Math.round(transaction_amount*100)/100;

                Transactions otherofferTransaction = new Transactions(trans_id, offer, offer.getUser().getUserId(),expirationDate,transaction_remit_amount);
                emailService.sendTransactionEmail(sourceOffer.getUser().getNickName(),offer.getUser().getEmailId(),
                        offer.getUser().getNickName(),offer.getSrcCurrency(),offer.getRemitAmount());
                transactionsRepository.save(otherofferTransaction);
            }
            String emailMessage="Please complete your transaction in the next 10 minutes otherwise it will get aborted!";
            emailService.sendCustomNotification(sourceOffer.getUser().getNickName(), sourceOffer.getUser().getEmailId(),"DirectExchange - Complete Offer Transaction!", emailMessage);
            return ResponseEntity.status(HttpStatus.OK).body(newTransaction);

        }catch (Exception e){
            System.out.println("Error "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later!");
        }

    }

    public ResponseEntity updateTransaction(Long offer_id,
                                            String transaction_id,Long remit_accountid,Long destination_accountid){

        try {
            ZonedDateTime currentDateTime = ZonedDateTime.now(ZoneOffset.UTC);
            String currentStatus = transactionsRepository.getTransactionStatus(transaction_id,currentDateTime);
            if(currentStatus==null){
                setAtFaultTransactions(transaction_id);
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Transaction has been aborted!!");
            }
            if(!currentStatus.equals("pending")){
                return ResponseEntity.status(HttpStatus.CONFLICT).body("Transaction has been "+currentStatus);
            }
            ExchangeOffer offer = exchangeOfferRepository.findByofferId(offer_id);
            offer.setStatus("InTransaction");
            List<Transactions> currentTransactions = transactionsRepository.findByTransactionId(transaction_id);

            boolean isTransactionComplete = true;
            for(Transactions transaction:currentTransactions){

                if(transaction.getOfferDetails().getOfferId()==offer_id){
                    transaction.setIs_complete(1);
                    transaction.setRemit_account_id(remit_accountid);
                    transaction.setDest_account_id(destination_accountid);
                    transactionsRepository.save(transaction);
                }
                else if(transaction.getIs_complete()!=1){
                    isTransactionComplete=false;
                }

            }

            if(isTransactionComplete){
                List<Long> offersCompleted = new ArrayList<Long>();
                for(Transactions transaction:currentTransactions){
                    transaction.setTransactionStatus("completed");
                    transaction.getOfferDetails().setStatus("Fulfilled");
                    ExchangeOffer completedOffer= transaction.getOfferDetails();
                    float amount =Math.round(completedOffer.getFinalAmount() * 0.9995 *100)/100;
                    String message ="Your transaction has been completed\n Recipient has received "+Float.toString(amount);
                    emailService.sendCustomNotification(completedOffer.getUser().getNickName(), completedOffer.getUser().getEmailId(),"DirectExchange - Transaction Completed!", message);
                    offersCompleted.add(transaction.getOfferDetails().getOfferId());
                }
                List<String> otherTransactions = transactionsRepository.findOtherTransactions(offersCompleted,transaction_id);
                transactionsRepository.updateTransactionStatus("aborted",otherTransactions);

                List<Transactions> transactions = transactionsRepository.getTransactionsByTransactionIds(otherTransactions);
                List<Long> offersToReset = new ArrayList<Long>();
                for(Transactions t: transactions){
                    if(!t.getOfferDetails().getStatus().equals("Fulfilled"))
                        offersToReset.add(t.getOfferDetails().getOfferId());
                }
                exchangeOfferRepository.resetOfferStatus(offersToReset,"Open");
            }

            return ResponseEntity.status(HttpStatus.OK).body("Success");
        }catch (Exception e){
            System.out.println("Error "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later!");
        }

    }

    public ResponseEntity getTransactions(Long userid){

        try {
            JSONObject data = new JSONObject();
            List<BankAccount> bankAccounts = bankAccountRepository.findByUserUserId(userid);
            List<Transactions> transactionDetails = transactionsRepository.fetchTransactionsByUserID(userid);
            data.put("transactionDetails",transactionDetails);
            data.put("bankAccounts",bankAccounts);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch (Exception e){
            System.out.println("Error "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later!");
        }
    }

    public void setAtFaultTransactions(String transaction_id){

        try{
            int updated = transactionsRepository.updateAbortedTransactionStatus("aborted",transaction_id);
            System.out.println("Updated "+updated+"\n\n\n");
            if(updated!=0){
                List<Transactions> transactions = transactionsRepository.findByTransactionId(transaction_id);

                List<Long> offersToReset = new ArrayList<Long>();
                for(Transactions t: transactions){
                    if(!t.getOfferDetails().getStatus().equals("Fulfilled"))
                        offersToReset.add(t.getOfferDetails().getOfferId());
                }
                exchangeOfferRepository.resetOfferStatus(offersToReset,"Open");
            }

        }catch(Exception e){
            System.out.println("Error "+e.getMessage());
        }

    }


    public ResponseEntity getTransactionHistory(Long userid){

        try {
            JSONObject data = new JSONObject();
            List<Object> transactionHistory = transactionsRepository.fetchTransactionHistoryByUserID(userid);

            data.put("transactionHistory",transactionHistory);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch (Exception e){
            System.out.println("Error "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later!");
        }
    }
    public ResponseEntity getSystemReport(){

        try {
            JSONObject data = new JSONObject();
            data.put("completedTransactions",transactionsRepository.getCompletedTransactions().size());
            data.put("uncompleteTransactions",transactionsRepository.getUnCompletedTransactions().size());
            data.put("totalRemitAmount", transactionsRepository.getTotalRemittedAmount());
            List<Transactions> transactionDetails = transactionsRepository.findAll();
            data.put("transactionDetails",transactionDetails);
            return new ResponseEntity<>(data, HttpStatus.OK);
        }catch (Exception e){
            System.out.println("Error "+e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later!");
        }
    }

}
