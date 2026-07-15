package com.example.jobportal;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataGenerator implements CommandLineRunner {

    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    public DataGenerator(CompanyRepository companyRepository,
                         JobRepository jobRepository) {
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
    }

    private final Random random = new Random();

    private List<String> companyNames;
    private List<String> locations;
    private List<String> industries;
    private List<String> jobTitles;
    private List<String> technologies;

    @Override
    public void run(String... args) throws Exception {

        if (companyRepository.count() > 0 || jobRepository.count() > 0) {
            System.out.println("Database already contains data.");
            return;
        }

        companyNames = readFile("companynames.txt");
        locations = readFile("locations.txt");
        industries = readFile("industries.txt");
        jobTitles = readFile("jobtitles.txt");
        technologies = readFile("languages.txt");

        generateCompanies();

        generateFullTimeJobs();

        generateInternships();

        System.out.println("=================================");
        System.out.println("Dataset Generated Successfully");
        System.out.println("Companies : 400");
        System.out.println("Jobs      : 1000");
        System.out.println("Interns   : 400");
        System.out.println("=================================");
    }

    private List<String> readFile(String file) throws Exception {

        List<String> list = new ArrayList<>();

        BufferedReader br = new BufferedReader(
                new InputStreamReader(
                        new ClassPathResource(file).getInputStream()
                )
        );

        String line;

        while ((line = br.readLine()) != null) {

            if (!line.trim().isEmpty()) {
                list.add(line.trim());
            }

        }

        br.close();

        return list;
    }

    private String randomLocation() {
        return locations.get(random.nextInt(locations.size()));
    }

    private String randomIndustry() {
        return industries.get(random.nextInt(industries.size()));
    }

    private String randomTitle() {
        return jobTitles.get(random.nextInt(jobTitles.size()));
    }

    private String randomTechnology() {

        Collections.shuffle(technologies);

        return String.join(", ",
                technologies.subList(0, 3));

    }

    private String randomExperience() {

        String[] exp = {
                "Fresher",
                "0-1 Years",
                "1-2 Years",
                "2-3 Years",
                "3-5 Years",
                "5-7 Years"
        };

        return exp[random.nextInt(exp.length)];
    }

    private String randomSalary(String experience) {

        double min, max;

        switch(experience) {

            case "Fresher":
            case "0-1 Years":
                min = 3.0; max = 6.0;
                break;

            case "1-2 Years":
                min = 5.0; max = 9.0;
                break;

            case "2-3 Years":
                min = 7.5; max = 13.0;
                break;

            case "3-5 Years":
                min = 11.0; max = 19.0;
                break;

            case "5-7 Years":
                min = 16.0; max = 30.0;
                break;

            default:
                min = 4.0; max = 10.0;

        }

        double salary = min + (random.nextDouble() * (max - min));

        return String.format("%.1f LPA", salary);
    }

    private String randomStipend() {

        // ~25% of internships are unpaid, like real portals —
        // the rest get a genuinely random stipend range.
        boolean unpaid = random.nextInt(100) < 25;

        if (unpaid) {
            return "Unpaid";
        }

        int stipend = 8000 + (random.nextInt(23) * 1000);

        return stipend + " INR/Month";
    }

    private String randomInternExperience() {

        String[] exp = {
                "Fresher",
                "Fresher",
                "Fresher",
                "Pursuing Degree",
                "0-1 Years"
        };

        return exp[random.nextInt(exp.length)];
    }

    private String randomDuration() {

        String[] duration = {
                "2 Months",
                "3 Months",
                "4 Months",
                "5 Months",
                "6 Months"
        };

        return duration[random.nextInt(duration.length)];
    }

    private String jobDescription(String title, String company) {

        return "We are looking for a passionate " + title +
                " to join " + company +
                ". Candidates will work on real-world enterprise projects using modern technologies while collaborating with experienced engineering teams.";
    }
    // ===========================
    // GENERATE 400 COMPANIES
    // ===========================

    private void generateCompanies() {

        int limit = Math.min(400, companyNames.size());

        for (int i = 0; i < limit; i++) {

            String companyName = companyNames.get(i);

            Company company = new Company();

            company.setName(companyName);

            company.setLocation(randomLocation());

            company.setIndustry(randomIndustry());

            String website = companyName
                    .toLowerCase()
                    .replace("&", "")
                    .replace(",", "")
                    .replace(".", "")
                    .replace("'", "")
                    .replace(" ", "");

            company.setWebsite("https://www." + website + ".com");

            company.setDescription(generateCompanyDescription(
                    companyName,
                    company.getIndustry()
            ));

            companyRepository.save(company);

        }

    }

    // ===========================
    // COMPANY DESCRIPTION
    // ===========================

    private String generateCompanyDescription(String company,
                                              String industry) {

        String[] desc = {

                company + " is a leading " + industry +
                        " organization delivering innovative enterprise solutions worldwide.",

                company + " provides excellent career growth, modern technologies, employee-friendly culture, and exciting software development opportunities.",

                company + " focuses on digital transformation, cloud computing, AI, automation, cybersecurity, and enterprise software products.",

                company + " offers challenging projects, global clients, continuous learning programs, competitive benefits, and collaborative engineering teams.",

                company + " is known for innovation, customer satisfaction, technical excellence, and delivering high-quality technology solutions."
        };

        return desc[random.nextInt(desc.length)];

    }

    // ===========================
    // RANDOM POSTED BY
    // ===========================

    private Integer randomPostedBy() {

        return 1;

    }
    // ===========================
// GENERATE 1000 FULL TIME JOBS
// ===========================

    private void generateFullTimeJobs() {

        List<Company> companies = companyRepository.findAll();

        for (int i = 1; i <= 1000; i++) {

            Company company =
                    companies.get(random.nextInt(companies.size()));

            Job job = new Job();

            String title = randomTitle();

            job.setTitle(title);

            job.setCompany(company.getName());

            job.setLocation(company.getLocation());

            job.setLanguage(randomTechnology());

            job.setExperience(randomExperience());

            job.setSalary(randomSalary(job.getExperience()));

            job.setDescription(
                    jobDescription(title, company.getName())
            );

            job.setType("JOB");

            job.setDuration(null);

            job.setStipend(null);

            job.setPostedBy(randomPostedBy());

            job.setCreatedAt(LocalDateTime.now());

            jobRepository.save(job);

        }

    }
    // ===========================
// GENERATE 400 INTERNSHIPS
// ===========================

    private void generateInternships() {

        List<Company> companies = companyRepository.findAll();

        for (int i = 1; i <= 400; i++) {

            Company company =
                    companies.get(random.nextInt(companies.size()));

            Job job = new Job();

            String title = randomTitle() + " Intern";

            job.setTitle(title);

            job.setCompany(company.getName());

            job.setLocation(company.getLocation());

            job.setLanguage(randomTechnology());

            job.setExperience(randomInternExperience());

            job.setSalary(null);

            job.setDuration(randomDuration());

            job.setStipend(randomStipend());

            job.setDescription(
                    "Join " + company.getName() +
                            " as a " + title +
                            ". This internship provides hands-on experience with live projects, mentoring from senior engineers, and opportunities to build practical technical skills."
            );

            job.setType("INTERN");

            job.setPostedBy(randomPostedBy());

            job.setCreatedAt(LocalDateTime.now());

            jobRepository.save(job);

        }

    }
}