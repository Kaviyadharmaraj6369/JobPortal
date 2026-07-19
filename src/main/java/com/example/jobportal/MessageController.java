
package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

        import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository repository;

    // All messages for one application, oldest first — used to
    // render the chat thread on both the applicant and admin side.
    @GetMapping("/application/{applicationId}")
    public List<Message> getMessages(@PathVariable Integer applicationId) {

        return repository.findByApplicationIdOrderBySentAtAsc(applicationId);

    }

    @PostMapping
    public Message send(@RequestBody Message message) {

        message.setSentAt(LocalDateTime.now());

        return repository.save(message);

    }

}