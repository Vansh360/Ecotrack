package com.ecotrack.backend.anomaly;

import java.util.List;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/anomaly-reviews")
public class AnomalyReviewController {

    private final AnomalyReviewService service;

    public AnomalyReviewController(AnomalyReviewService service) {
        this.service = service;
    }

    @GetMapping
    public List<AnomalyReviewDtos.ReviewResponse> getReviews(
            Authentication authentication
    ) {
        return service.getReviews(authentication.getName());
    }

    @PutMapping("/{activityId}")
    public AnomalyReviewDtos.ReviewResponse saveReview(
            @PathVariable Long activityId,
            @Valid @RequestBody AnomalyReviewDtos.ReviewRequest request,
            Authentication authentication
    ) {
        return service.saveReview(
                authentication.getName(),
                activityId,
                request
        );
    }
}
