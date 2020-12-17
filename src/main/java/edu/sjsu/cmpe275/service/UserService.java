package edu.sjsu.cmpe275.service;

import edu.sjsu.cmpe275.dao.User;
import edu.sjsu.cmpe275.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import java.util.regex.Pattern;

@Service
@Slf4j
public class UserService {

    @Autowired
    private UserRepository userRepository;

    private static String regex = "^[a-zA-Z0-9]+$";
    private static Pattern alphaNumericPattern = Pattern.compile(regex);

    public ResponseEntity<?> getUser(@NonNull long userId) {

        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }

    public ResponseEntity<?> updateUser(@NonNull long userId, String nickName) {

        if (!StringUtils.hasText(nickName)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NickName cannot be null");
        }
        if (!alphaNumericPattern.matcher(nickName).matches()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("NickName should be alpha-numeric");
        }

        User user = userRepository.findByUserId(userId);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }

        if (user.getNickName().equals(nickName)) {
            return ResponseEntity.status(HttpStatus.OK).body(user);
        }

        User userWithNickName = userRepository.findByNickName(nickName);
        if (userWithNickName != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nick Name already in use!");
        }
        user.setNickName(nickName);
        userRepository.save(user);
        return ResponseEntity.status(HttpStatus.OK).body(user);
    }
}
