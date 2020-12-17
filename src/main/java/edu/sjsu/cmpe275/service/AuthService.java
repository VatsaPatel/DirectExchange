package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import edu.sjsu.cmpe275.repository.UserRepository;
import edu.sjsu.cmpe275.representation.AuthenticationResponse;
import edu.sjsu.cmpe275.security.jwt.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.lang.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;
import java.util.regex.Pattern;

@Service
@Slf4j
public class AuthService {

    private static String regex = "^[0-9]+$";
    private static Pattern emailPattern = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);


    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Registers an User with password.
     * @param emailId emailId of the user to register.
     * @param nickName nickName of the user to register.
     * @param password password of the user.
     * @param registrationType registrationType of the user.
     * @return saved user's ResponseEntity.
     */
    public ResponseEntity registerUser(@NonNull String emailId,
                                       @NonNull String nickName,
                                       @NonNull String password,
                                       @NonNull RegistrationType registrationType) {
        try{

            if(registrationType == RegistrationType.LOCAL) {
                if(!emailPattern.matcher(emailId).matches() ) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please provide a valid email id");
                }
            }

            User user = userRepository.findByEmailId(emailId);
            if (user != null) {
                return  ResponseEntity.status(HttpStatus.CONFLICT).body("User Already Present");
            }
            user = userRepository.findByNickName(nickName);
            if (user != null) {
                return  ResponseEntity.status(HttpStatus.CONFLICT).body("NickName Already Present");
            }

            try {
                User newUser = registerUserAndSendEmail(emailId, nickName, password, registrationType);
                return  ResponseEntity.status(HttpStatus.OK).body(newUser);
            } catch (Exception exception){
                return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
            }

        } catch (Exception exception) {
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(exception.getMessage());
        }
    }

    /**
     * Registers an user without a password.
     * @param emailId emailId of the user.
     * @param nickName nickName to be used.
     * @param registrationType registrationType of the user
     * @return registerd user.
     */
    public User registerUser(@NonNull String emailId,
                             @NonNull String nickName,
                             @NonNull RegistrationType registrationType) {
        if (registrationType == RegistrationType.LOCAL) {
            throw new IllegalArgumentException("Cannot create user for LOCAL without password");
        }
        return registerUserAndSendEmail(emailId, nickName, null, registrationType);
    }

    /**
     * Saves the user in DB and sends an email with verification code.
     * @param emailId emailId of the user.
     * @param nickName nickName of the user.
     * @param password password to be used for the user.
     * @param registrationType registrationType of the user.
     * @return Saved user.
     */
    private User registerUserAndSendEmail(@NonNull String emailId,
                                          @NonNull String nickName,
                                          @Nullable String password,
                                          @NonNull RegistrationType registrationType) {
        String emailVerificationCode = UUID.randomUUID().toString();

        User newUser = new User();
        newUser.setEmailId(emailId);
        newUser.setNickName(nickName);
        newUser.setPassword(password == null
                ? null
                : passwordEncoder.encode(password));
        newUser.setRegistrationType(registrationType);
        newUser.setEmailVerified(false);
        newUser.setValidUser(false);
        newUser.setEmailVerificationCode(emailVerificationCode);
        User savedUser = userRepository.save(newUser);

        emailService.sendEmail(emailId, nickName, emailVerificationCode);
        return savedUser;
    }

    public ResponseEntity<?> loginUser(String emailId, String password) {

        User user = userRepository.findByEmailId(emailId);
        if (user == null) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Present");
        }
        if (user.getRegistrationType() != RegistrationType.LOCAL) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please login using " + user.getRegistrationType());
        }

        if (!passwordEncoder.matches(password, user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Username/Password does not match");
        }
        if (!user.getEmailVerified()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Email is not verified, please verify your email and try again.");
        }
        String token = jwtTokenProvider.createToken(user);
        return ResponseEntity.status(HttpStatus.OK).body(new AuthenticationResponse(token));
    }

    /**
     * Verify user based on the email verification code.
     * @param emailVerificationCode email verification code of the user.
     * @return ResponseEntity based on the status of the emailVerificationCode.
     */
    public ResponseEntity<?> verifyUserEmail(String emailVerificationCode) {
        User user = userRepository.findByEmailVerificationCode(emailVerificationCode);
        if (user == null) {
            log.warn("Unknown verification code {}", emailVerificationCode);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unknown verification code");
        }
        if (user.getEmailVerified()) {
            log.warn("User email already verified {}", emailVerificationCode);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Unknown verification code");
        } else {
            user.setEmailVerified(true);
            userRepository.save(user);
            return ResponseEntity.status(HttpStatus.OK).body("Successfully verified email!");
        }
    }
}
