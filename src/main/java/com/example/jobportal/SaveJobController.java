package com.example.jobportal;

import com.example.jobportal.SavedJob;
import com.example.jobportal.SaveJobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/save")
@CrossOrigin("*")
public class SaveJobController {

    @Autowired
    private SaveJobService service;

    @PostMapping
    public SavedJob save(@RequestBody SavedJob sj) {

        if(sj.getUserId() == 0){
            return null;
        }

        return service.saveJob(sj);
    }

    @GetMapping("/user/{userId}")
    public List<SavedJob> getUserSavedJobs(
            @PathVariable int userId) {

        return service.getUserSavedJobs(userId);
    }
}