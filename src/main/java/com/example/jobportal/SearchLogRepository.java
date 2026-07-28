package com.example.jobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SearchLogRepository extends JpaRepository<SearchLog, Integer> {

    List<SearchLog> findAll();

}