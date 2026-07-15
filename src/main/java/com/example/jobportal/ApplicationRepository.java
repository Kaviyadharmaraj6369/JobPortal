package com.example.jobportal;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {

    List<Application> findByUserId(int userId);

}