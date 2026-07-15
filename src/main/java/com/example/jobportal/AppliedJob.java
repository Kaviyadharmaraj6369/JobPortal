
package com.example.jobportal;

import jakarta.persistence.*;
        import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "applied_jobs")
public class AppliedJob {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="user_id")
    private Integer userId;

    @Column(name="job_id")
    private Integer jobId;

    @Column(name="full_name")
    private String fullName;

    private String email;

    private String phone;

    private LocalDate dob;

    private String qualification;

    private String college;

    @Column(name="passing_year")
    private String passingYear;

    private String experience;

    @Column(columnDefinition = "TEXT")
    private String skills;

    @Column(name="current_location")
    private String currentLocation;

    private String linkedin;
    private String github;

    private String portfolio;

    private String leetcode;

    private String hackerrank;

    @Column(name="resume_path")
    private String resumePath;

    private String status;

    @Column(name="applied_date")
    private LocalDateTime appliedDate;

    public AppliedJob() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getUserId() {
        return userId;
    }

    public void setUserId(Integer userId) {
        this.userId = userId;
    }

    public Integer getJobId() {
        return jobId;
    }

    public void setJobId(Integer jobId) {
        this.jobId = jobId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDate getDob() {
        return dob;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }

    public String getQualification() {
        return qualification;
    }

    public void setQualification(String qualification) {
        this.qualification = qualification;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getPassingYear() {
        return passingYear;
    }

    public void setPassingYear(String passingYear) {
        this.passingYear = passingYear;
    }

    public String getExperience() {
        return experience;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getCurrentLocation() {
        return currentLocation;
    }

    public void setCurrentLocation(String currentLocation) {
        this.currentLocation = currentLocation;
    }

    public String getLinkedin() {
        return linkedin;
    }

    public void setLinkedin(String linkedin) {
        this.linkedin = linkedin;
    }

    public String getResumePath() {
        return resumePath;
    }
    public String getGithub() {
        return github;
    }

    public void setGithub(String github) {
        this.github = github;
    }

    public String getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(String portfolio) {
        this.portfolio = portfolio;
    }

    public String getLeetcode() {
        return leetcode;
    }

    public void setLeetcode(String leetcode) {
        this.leetcode = leetcode;
    }

    public String getHackerrank() {
        return hackerrank;
    }

    public void setHackerrank(String hackerrank) {
        this.hackerrank = hackerrank;
    }

    public void setResumePath(String resumePath) {
        this.resumePath = resumePath;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(LocalDateTime appliedDate) {
        this.appliedDate = appliedDate;
    }
}