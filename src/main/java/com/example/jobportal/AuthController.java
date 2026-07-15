package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository repo;

    private BCryptPasswordEncoder encoder =
            new BCryptPasswordEncoder();

    // ================= REGISTER =================

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody User user) {

        User existing =
                repo.findByEmail(user.getEmail());

        if (existing != null) {

            return ResponseEntity
                    .badRequest()
                    .body("EMAIL_EXISTS");

        }

        user.setPassword(
                encoder.encode(user.getPassword())
        );

        User saved =
                repo.save(user);

        return ResponseEntity.ok(saved);

    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User user) {

        User dbUser =
                repo.findByEmail(user.getEmail());

        if (dbUser == null) {

            return ResponseEntity
                    .status(401)
                    .body("USER_NOT_FOUND");

        }

        if (!encoder.matches(
                user.getPassword(),
                dbUser.getPassword())) {

            return ResponseEntity
                    .status(401)
                    .body("WRONG_PASSWORD");

        }

        return ResponseEntity.ok(dbUser);

    }

}