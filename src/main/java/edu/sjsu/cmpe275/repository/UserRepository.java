package edu.sjsu.cmpe275.repository;

import edu.sjsu.cmpe275.dao.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface UserRepository extends JpaRepository<User, String> {

    /**
     * @param userId
     * @return User object
     * Returns the User object based on the userId provided
     */
    User findByUserId(Long userId);

    /**
     * @param emailId
     * @return User object
     * Returns the User object based on the emailId provided
     */
    User findByEmailId(String emailId);

    /**
     * @param nickName
     * @return User object
     * Returns the User object based on the nickname provided
     */
    User findByNickName(String nickName);

    /**
     * Find user based on the verification code.
     * @param emailVerificationCode verification code to look up for.
     * @return User if found, else null.
     */
    User findByEmailVerificationCode(String emailVerificationCode);

    @Modifying
    @Query(value="update users set rating=:rating where id=:userId", nativeQuery = true)
    int updateUserRating(Long userId, Integer rating);
}
