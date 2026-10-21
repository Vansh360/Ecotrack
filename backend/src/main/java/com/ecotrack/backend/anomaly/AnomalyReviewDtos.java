package com.ecotrack.backend.anomaly;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class AnomalyReviewDtos {

    private AnomalyReviewDtos() {
    }

    public record ReviewRequest(
            @NotNull AnomalyReviewStatus status,
            @Size(max = 1000) String note
    ) {
    }

    public record ReviewResponse(
            Long id,
            Long activityId,
            AnomalyReviewStatus status,
            String note,
            LocalDateTime createdAt,
            LocalDateTime updatedAt
    ) {
        public static ReviewResponse from(AnomalyReview review) {
            return new ReviewResponse(
                    review.getId(),
                    review.getActivityId(),
                    review.getStatus(),
                    review.getNote(),
                    review.getCreatedAt(),
                    review.getUpdatedAt()
            );
        }
    }
}
