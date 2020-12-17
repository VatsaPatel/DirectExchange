package edu.sjsu.cmpe275.repository;

import edu.sjsu.cmpe275.dao.BankAccount;
import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.representation.BankAccountCreateRepresentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface BankAccountRepository extends JpaRepository<BankAccount, String> {

    /**
     * @param userId
     * @return User object
     * Returns the User object based on the userId provided
     */
    List<BankAccount> findByUserUserId(long userId);

//    @Query(value = "select country from bank_account where user_id=:user_id;", nativeQuery = true)
//    List<String> fetchCountriesByUserUserID(Long user_id);

}

