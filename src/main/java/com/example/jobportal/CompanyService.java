package com.example.jobportal.service;

import com.example.jobportal.Company;
import com.example.jobportal.CompanyRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CompanyService {

    @Autowired
    CompanyRepository repo;

    public List<Company> getCompanies(){
        return repo.findAll();
    }

    public Company save(Company c){
        return repo.save(c);
    }

}