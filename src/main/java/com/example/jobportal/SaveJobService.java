package com.example.jobportal;

import com.example.jobportal.SavedJob;
import com.example.jobportal.SavedJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaveJobService {

    @Autowired
    private SavedJobRepository repo;

    public SavedJob saveJob(SavedJob sj) {

        SavedJob existing =
                repo.findByUserIdAndJobId(
                        sj.getUserId(),
                        sj.getJobId()
                );

        if(existing != null){
            return existing;
        }

        return repo.save(sj);
    }

    public List<SavedJob> getUserSavedJobs(int userId) {

        return repo.findByUserId(userId);
    }
}