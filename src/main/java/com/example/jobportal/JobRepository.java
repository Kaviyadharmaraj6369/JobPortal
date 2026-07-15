package com.example.jobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Integer> {

    List<Job> findByTitleContainingOrCompanyContainingOrLocationContaining(
            String title,
            String company,
            String location
    );

    List<Job> findByType(String type);

}