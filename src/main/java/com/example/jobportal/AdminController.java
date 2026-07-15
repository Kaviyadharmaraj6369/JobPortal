package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ==========================================================
// Lightweight admin/reporting endpoints for the developer.
//
// NOTE: this has no authentication/authorization of its own —
// it is meant for local/dev use (viewed via admin.html) rather
// than a public-facing admin panel. Don't expose this route
// on a public deployment without adding a real admin login.
// ==========================================================

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private ApplyService applyService;

    // Users list, without exposing password hashes.
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {

        return userRepository.findAll()
                .stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "name", u.getName() == null ? "" : u.getName(),
                        "email", u.getEmail() == null ? "" : u.getEmail(),
                        "role", u.getRole() == null ? "" : u.getRole()
                ))
                .toList();
    }

    // Quick summary counts for the dashboard header.
    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        long totalUsers = userRepository.count();
        long totalCompanies = companyRepository.count();
        long totalJobs = jobRepository.count();
        long totalApplications = applyService.getAllApplications().size();

        return Map.of(
                "totalUsers", totalUsers,
                "totalCompanies", totalCompanies,
                "totalJobs", totalJobs,
                "totalApplications", totalApplications
        );
    }
}
