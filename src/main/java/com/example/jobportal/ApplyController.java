package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/apply")
@CrossOrigin(origins = "*")
public class ApplyController {

    @Autowired
    private ApplyService service;

    // ===========================
    // APPLY JOB
    // ===========================

    @PostMapping
    public ResponseEntity<?> apply(@RequestBody ApplyRequest request) {

        try {

            AppliedJob job = service.applyJob(request);

            return ResponseEntity.ok(job);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

    // ===========================
    // RESUME UPLOAD
    // ===========================

    @PostMapping("/upload")
    public ResponseEntity<?> uploadResume(
            @RequestParam("file") MultipartFile file) {

        try {

            if (file.isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body("No File Selected");

            }

            String uploadDir = "uploads/";

            Files.createDirectories(Paths.get(uploadDir));

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path path =
                    Paths.get(uploadDir + fileName);

            Files.write(path, file.getBytes());

            return ResponseEntity.ok(fileName);

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .body("Resume Upload Failed");

        }

    }

    // ===========================
    // USER APPLICATIONS
    // ===========================

    @GetMapping("/user/{userId}")
    public List<AppliedJob> getUserApplications(
            @PathVariable Integer userId) {

        return service.getUserApplications(userId);

    }

    // ===========================
    // ALL APPLICATIONS
    // ===========================

    @GetMapping("/all")
    public List<AppliedJob> getAllApplications() {

        return service.getAllApplications();

    }

    // ===========================
    // UPDATE STATUS
    // ===========================

    @PutMapping("/{id}/{status}")
    public AppliedJob updateStatus(
            @PathVariable Integer id,
            @PathVariable String status) {

        return service.updateStatus(id, status);

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> withdraw(@PathVariable Integer id) {

        try {

            service.withdraw(id);

            return ResponseEntity.ok("Application withdrawn successfully");

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());

        }

    }

}