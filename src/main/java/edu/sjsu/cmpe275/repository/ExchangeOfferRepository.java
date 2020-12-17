package edu.sjsu.cmpe275.repository;

import edu.sjsu.cmpe275.dao.ExchangeOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ExchangeOfferRepository extends JpaRepository<ExchangeOffer, String> {

    @Query(value="select * from exchange_offer where user_id!=:id and status='Open' order by offer_id desc", nativeQuery = true)
    // Query to not get email: elect `offer_id`,`counter_offer_flag`,`dest_country`,`dest_currency`,`exchange_rate`,`exp_date`,`final_amount`,`remit_amount`,`split_offer_flag`,`src_country`,`src_currency`,`status`,`user_id`,users.nickname as 'poster_name' from exchange_offer,users where users.id=exchange_offer.user_id AND user_id!=8
    List<ExchangeOffer> getOffersByOthers(Long id);

//    @Query(value="select * from exchange_offer where user_id=:userId order by offer_id desc", nativeQuery = true)
    @Query(value="select * from exchange_offer where user_id=:userId order by status desc,offer_id desc", nativeQuery = true)
    List<ExchangeOffer> findByUserId(Long userId);

    @Query(value="select * from exchange_offer where user_id!=:userId and src_currency = :srcCurrency and dest_currency=:destCurrency and exp_date > now() and remit_amount between :remitAmount*0.9 and :remitAmount*1.1 and status='Open' order by remit_amount desc", nativeQuery = true)
    List<ExchangeOffer> findSingleMatches(Long userId, Integer remitAmount, String srcCurrency, String destCurrency);

    @Query(value="select * from exchange_offer where user_id!=:id and src_currency = :srcCurrency and dest_currency=:destCurrency and exp_date > now() and status='Open'", nativeQuery = true)
    List<ExchangeOffer> getOffersBySrcCurrency(Long id, String srcCurrency, String destCurrency);

    ExchangeOffer findByofferId(long offer_id);

    @Query(value="select * from exchange_offer where offer_id in(:offer_id) and (status='Open' or status='CounterMade') and exp_date>now() ", nativeQuery = true)
    List<ExchangeOffer> getOffersDetails(List<Long> offer_id);

    @Query(value="select * from exchange_offer where offer_id =:offer_id and status=:status and exp_date>now() ", nativeQuery = true)
    ExchangeOffer findByOfferIdAndStatus(Long offer_id, String status);

    @Modifying
    @Query(value="update exchange_offer set status=:status where offer_id =:id ", nativeQuery = true)
    int updateExchangeOfferStatus(Long id, String status);

    @Modifying
    @Query(value="update exchange_offer set status=:status where offer_id in(:offer_id) ", nativeQuery = true)
    int resetOfferStatus(List<Long> offer_id, String status);

    @Query(value="select * from exchange_offer where offer_id=:offerId", nativeQuery = true)
    ExchangeOffer findOfferDetailById(Long offerId);

    @Modifying
    @Query(value="update exchange_offer set status=:status where offer_id =:offer_id ", nativeQuery = true)
    int resetOfferStatusOfOne(Long offer_id, String status);
}
