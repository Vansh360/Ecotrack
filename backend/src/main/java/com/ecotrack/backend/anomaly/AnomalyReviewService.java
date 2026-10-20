package com.ecotrack.backend.anomaly;

import java.util.List;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecotrack.backend.activity.ActivityRepository;
import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;

@Service
public class AnomalyReviewService {

    private final AnomalyReviewRepository reviewRepository;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public AnomalyReviewService(
            AnomalyReviewRepository reviewRepository,
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<AnomalyReviewDtos.ReviewResponse> getReviews(String email) {
        User user = findUser(email);

        return reviewRepository
                .findByUser_IdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(AnomalyReviewDtos.ReviewResponse::from)
                .toList();
    }

    @Transactional
    public AnomalyReviewDtos.ReviewResponse saveReview(
            String email,
            Long activityId,
            AnomalyReviewDtos.ReviewRequest request
    ) {
        User user = findUser(email);

        Activity activity = activityRepository.findById(activityId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Activity not found"
                ));

        if (activity.getUser() == null
                || !Objects.equals(activity.getUser().getId(), user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot review another user's activity"
            );
        }

        AnomalyReview review = reviewRepository
                .findByUser_IdAndActivityId(user.getId(), activityId)
                .orElseGet(AnomalyReview::new);

        review.setUser(user);
        review.setActivityId(activityId);
        review.setStatus(request.status());
        review.setNote(request.note() == null ? null : request.note().trim());

        return AnomalyReviewDtos.ReviewResponse.from(
                reviewRepository.save(review)
        );
    }

    private User findUser(String email) {
        return userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));
    }
}
