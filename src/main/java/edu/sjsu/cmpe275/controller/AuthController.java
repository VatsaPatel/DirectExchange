package edu.sjsu.cmpe275.controller;

import edu.sjsu.cmpe275.dao.enums.RegistrationType;
import edu.sjsu.cmpe275.service.AuthService;
import edu.sjsu.cmpe275.service.EmailService;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.MimeType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.regex.Pattern;

@RestController
@CrossOrigin
@RequestMapping("auth")
public class AuthController {
    Logger logger = LoggerFactory.getLogger(AuthController.class);

    private static String regex = "^[0-9]+$";
    private static Pattern emailPattern = Pattern.compile("^[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,6}$", Pattern.CASE_INSENSITIVE);

    @Autowired
    private AuthService authService;

    @Autowired
    private EmailService emailService;

    @PostMapping(value = "/signup", produces = { MediaType.APPLICATION_JSON_VALUE },  consumes = { MediaType.APPLICATION_JSON_VALUE } )
    public ResponseEntity<?> signup(@RequestBody JSONObject object){

        String emailId = (String)object.get("emailId");
        String password = (String)object.get("password");
        String nickname = (String)object.get("nickname");

        if(! (StringUtils.hasText(emailId) && StringUtils.hasText(password) && StringUtils.hasText(nickname))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill in all fields");
        }

        logger.info("email id - {} nickname - {}",emailId, nickname );
        return authService.registerUser(emailId, nickname, password, RegistrationType.LOCAL);
    }

    @PostMapping(value = "/login", produces = { MediaType.APPLICATION_JSON_VALUE },  consumes = { MediaType.APPLICATION_JSON_VALUE } )
    public ResponseEntity<?> login(@RequestBody JSONObject object){

        String emailId = (String)object.get("emailId");
        String password = (String)object.get("password");

        if(! (StringUtils.hasText(emailId) && StringUtils.hasText(password))) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill in all fields");
        }

        if(!emailPattern.matcher(emailId).matches() ) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please provide a valid email id");
        }

        logger.info("email id - {}",emailId );
        return authService.loginUser(emailId, password);
    }

    @PostMapping(value = "/verify", produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> verifyEmailCode(@RequestBody JSONObject object) {

        String code = (String)object.get("code");
        if(!StringUtils.hasText(code)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please provide the verification code");
        }
        return authService.verifyUserEmail(code);
    }

}
