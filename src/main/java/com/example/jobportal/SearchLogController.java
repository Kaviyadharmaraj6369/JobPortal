package com.example.jobportal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/search-log")
@CrossOrigin(origins = "*")
public class SearchLogController {

    @Autowired
    private SearchLogRepository repository;

    // Called every time a user searches something on the home page.
    @PostMapping
    public void logSearch(@RequestBody Map<String, String> body) {

        String keyword = body.get("keyword");

        if (keyword == null || keyword.trim().isEmpty()) {
            return;
        }

        SearchLog log = new SearchLog();
        log.setKeyword(keyword.trim());
        log.setSearchedAt(LocalDateTime.now());

        repository.save(log);

    }

    // Returns the most-searched keywords with their counts, for
    // the admin dashboard — e.g. [{keyword: "java", count: 42}, ...]
    @GetMapping("/top")
    public List<Map<String, Object>> getTopSearches() {

        List<SearchLog> all = repository.findAll();

        Map<String, Long> counts = all.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getKeyword().toLowerCase(),
                        Collectors.counting()
                ));

        return counts.entrySet().stream()
                .sorted((a, b) -> Long.compare(b.getValue(), a.getValue()))
                .limit(20)
                .map(e -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("keyword", e.getKey());
                    m.put("count", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

    }

    // Total number of searches ever logged.
    @GetMapping("/count")
    public long getTotalSearches() {

        return repository.count();

    }

}