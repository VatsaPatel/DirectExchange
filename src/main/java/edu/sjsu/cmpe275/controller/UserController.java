package edu.sjsu.cmpe275.controller;

import com.fasterxml.jackson.databind.JsonNode;
import edu.sjsu.cmpe275.service.UserService;
import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin
@RequestMapping("profile")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("#userId.toString() == authentication.principal")
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUser(@PathVariable("userId") Long userId) {
        return userService.getUser(userId);
    }

    @PreAuthorize("#userId.toString() == authentication.principal")
    @PutMapping("/{userId}")
    public ResponseEntity<?> updateUser(@PathVariable("userId") Long userId,
                                        @RequestBody JSONObject updateUser) {
        String nickName = (String)updateUser.get("nickName");
        return userService.updateUser(userId, nickName);
    }

}
