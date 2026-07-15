package com.example.jobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SavedJobRepository extends JpaRepository<SavedJob,Integer>{

    SavedJob findByUserIdAndJobId(int userId,int jobId);

    List<SavedJob> findByUserId(int userId);

}