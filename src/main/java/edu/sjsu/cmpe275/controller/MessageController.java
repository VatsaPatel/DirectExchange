package edu.sjsu.cmpe275.controller;

import edu.sjsu.cmpe275.repository.UserRepository;
import edu.sjsu.cmpe275.service.EmailService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin
@RequestMapping("api/message")
@Slf4j
public class MessageController {


    @Autowired
    private EmailService emailService;

    @Autowired
    private UserRepository userRepository;

    @PreAuthorize("#userId == authentication.principal")
    @PostMapping(value = "/{id}", produces = {"application/json"})
    public ResponseEntity sendMessage(@PathVariable(value = "id") String userId,
                                            @RequestParam(name = "receiver_name")  String receiver_name,
                                            @RequestParam(name = "receiver_email") String receiver_email,
                                            @RequestParam(name = "message") String message
    ){
        System.out.println("test" + receiver_email);
        System.out.println("test" + receiver_name);
        System.out.println("test" + message);
        System.out.println("test" + receiver_email);

        Long id = Long.parseLong(userId);

        String sender_name = userRepository.findByUserId(id).getNickName();
        if(emailService.sendMessageNotification(sender_name,receiver_name,receiver_email,message)) {
            return ResponseEntity.status(HttpStatus.OK).body("Success");
        }
        else{
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Something went wrong! Please try again later");
        }

    }
}
