package com.example.jobportal;

import com.example.jobportal.Job;
import com.example.jobportal.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {


    @Autowired
    private JobRepository repo;

    public List<Job> getAllJobs() {
        return repo.findAll();
    }

    public Job getJobById(int id) {
        return repo.findById(id).orElse(null);
    }

    public Job addJob(Job job) {
        return repo.save(job);
    }

    public List<Job> search(String key) {
        return repo.findByTitleContainingOrCompanyContainingOrLocationContaining(
                key, key, key
        );
    }

    public List<Job> getJobsByType(String type) {
        return repo.findByType(type);
    }


}
