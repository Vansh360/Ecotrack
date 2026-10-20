package com.ecotrack.backend.anomaly;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.ecotrack.backend.activity.ActivityRepository;
import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;

@ExtendWith(MockitoExtension.class)
class AnomalyReviewServiceTest {

    private static final String EMAIL = "person@example.com";
    private static final Long USER_ID = 7L;
    private static final Long ACTIVITY_ID = 42L;

    @Mock
    private AnomalyReviewRepository reviewRepository;

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private UserRepository userRepository;

    private AnomalyReviewService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new AnomalyReviewService(
                reviewRepository,
                activityRepository,
                userRepository
        );
        user = mock(User.class);
        when(userRepository.findByEmailIgnoreCase(EMAIL))
                .thenReturn(Optional.of(user));
    }

    @Test
    void savesTrimmedReviewForOwnedActivity() {
        when(user.getId()).thenReturn(USER_ID);
        Activity activity = mock(Activity.class);
        when(activity.getUser()).thenReturn(user);
        when(activityRepository.findById(ACTIVITY_ID))
                .thenReturn(Optional.of(activity));
        when(reviewRepository.findByUser_IdAndActivityId(USER_ID, ACTIVITY_ID))
                .thenReturn(Optional.empty());
        when(reviewRepository.save(any(AnomalyReview.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        AnomalyReviewDtos.ReviewResponse response = service.saveReview(
                EMAIL,
                ACTIVITY_ID,
                new AnomalyReviewDtos.ReviewRequest(
                        AnomalyReviewStatus.VERIFIED,
                        "  Checked  "
                )
        );

        assertEquals(ACTIVITY_ID, response.activityId());
        assertEquals(AnomalyReviewStatus.VERIFIED, response.status());
        assertEquals("Checked", response.note());
    }

    @Test
    void rejectsReviewOfAnotherUsersActivity() {
        when(user.getId()).thenReturn(USER_ID);
        Activity activity = mock(Activity.class);
        User otherUser = mock(User.class);
        when(otherUser.getId()).thenReturn(99L);
        when(activity.getUser()).thenReturn(otherUser);
        when(activityRepository.findById(ACTIVITY_ID))
                .thenReturn(Optional.of(activity));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.saveReview(
                        EMAIL,
                        ACTIVITY_ID,
                        new AnomalyReviewDtos.ReviewRequest(
                                AnomalyReviewStatus.VERIFIED,
                                null
                        )
                )
        );

        assertEquals(HttpStatus.FORBIDDEN, exception.getStatusCode());
    }

    @Test
    void returnsNotFoundWhenActivityDoesNotExist() {
        when(activityRepository.findById(ACTIVITY_ID))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.saveReview(
                        EMAIL,
                        ACTIVITY_ID,
                        new AnomalyReviewDtos.ReviewRequest(
                                AnomalyReviewStatus.VERIFIED,
                                null
                        )
                )
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(reviewRepository, org.mockito.Mockito.never())
                .save(any(AnomalyReview.class));
    }
}
