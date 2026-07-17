package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ApplyService {

    @Autowired
    private AppliedJobRepository repository;
    public void withdraw(Integer id) {

        if (!repository.existsById(id)) {

            throw new RuntimeException("Application Not Found");

        }

        repository.deleteById(id);

    }

    public AppliedJob applyJob(ApplyRequest request) {

        // Prevent duplicate application
        if (repository.existsByUserIdAndJobId(
                request.getUserId(),
                request.getJobId())) {

            throw new RuntimeException("You have already applied for this job.");
        }


        AppliedJob appliedJob = new AppliedJob();

        appliedJob.setUserId(request.getUserId());
        appliedJob.setJobId(request.getJobId());

        appliedJob.setFullName(request.getFullName());
        appliedJob.setEmail(request.getEmail());
        appliedJob.setPhone(request.getPhone());
        appliedJob.setDob(request.getDob());

        appliedJob.setQualification(request.getQualification());
        appliedJob.setCollege(request.getCollege());
        appliedJob.setPassingYear(request.getPassingYear());

        appliedJob.setExperience(request.getExperience());
        appliedJob.setSkills(request.getSkills());

        appliedJob.setCurrentLocation(request.getCurrentLocation());
        appliedJob.setLinkedin(request.getLinkedin());
        appliedJob.setGithub(request.getGithub());

        appliedJob.setPortfolio(request.getPortfolio());

        appliedJob.setLeetcode(request.getLeetcode());

        appliedJob.setHackerrank(request.getHackerrank());

        appliedJob.setResumePath(request.getResumePath());

        appliedJob.setStatus("PENDING");

        appliedJob.setAppliedDate(LocalDateTime.now());

        return repository.save(appliedJob);
    }

    public List<AppliedJob> getUserApplications(Integer userId) {

        return repository.findByUserId(userId);

    }

    public List<AppliedJob> getAllApplications() {

        return repository.findAll();

    }

    public AppliedJob updateStatus(Integer id, String status) {

        AppliedJob job =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Application Not Found"));

        job.setStatus(status);

        return repository.save(job);


    }
}