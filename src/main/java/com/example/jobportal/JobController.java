package com.example.jobportal;

import com.example.jobportal.Job;
import com.example.jobportal.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin("*")
public class JobController {


    @Autowired
    private JobService service;

    @GetMapping
    public List<Job> getAll() {
        return service.getAllJobs();
    }

    @GetMapping("/{id}")
    public Job getById(@PathVariable int id) {
        return service.getJobById(id);
    }

    @PostMapping
    public Job add(@RequestBody Job job) {
        return service.addJob(job);
    }

    @GetMapping("/search")
    public List<Job> search(@RequestParam String key) {
        return service.search(key);
    }

    @GetMapping("/interns")
    public List<Job> getInternJobs() {
        return service.getJobsByType("INTERN");
    }

    @GetMapping("/software")
    public List<Job> getSoftwareJobs() {
        return service.getJobsByType("SOFTWARE");
    }


}
