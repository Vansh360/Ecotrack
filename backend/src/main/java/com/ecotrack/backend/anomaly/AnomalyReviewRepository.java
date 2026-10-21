package com.ecotrack.backend.anomaly;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AnomalyReviewRepository
        extends JpaRepository<AnomalyReview, Long> {

    List<AnomalyReview> findByUser_IdOrderByUpdatedAtDesc(Long userId);

    Optional<AnomalyReview> findByUser_IdAndActivityId(
            Long userId,
            Long activityId
    );
}
