package com.example.jobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AppliedJobRepository extends JpaRepository<AppliedJob, Integer> {

    List<AppliedJob> findByUserId(Integer userId);

    List<AppliedJob> findByJobId(Integer jobId);

    boolean existsByUserIdAndJobId(Integer userId, Integer jobId);

}

