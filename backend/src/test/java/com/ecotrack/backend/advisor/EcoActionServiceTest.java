package com.ecotrack.backend.advisor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
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
class EcoActionServiceTest {

    @Mock
    private ActivityRepository activityRepository;

    @Mock
    private UserRepository userRepository;

    private EcoActionService service;
    private User user;

    @BeforeEach
    void setUp() {
        service = new EcoActionService(activityRepository, userRepository);
        user = new User();
        user.setEmail("person@example.com");
    }

    @Test
    void generatesSortedHotspotsAndScenarioSavingsFromAuthenticatedUser() {
        when(userRepository.findByEmailIgnoreCase("person@example.com"))
                .thenReturn(Optional.of(user));
        when(activityRepository.findByUserOrderByActivityDateDesc(user))
                .thenReturn(List.of(
                        activity("Transportation", 80.5),
                        activity("travel", 10.0),
                        activity("Energy", 35.0),
                        activity("OTHER", 99.0),
                        activity("Water", Double.NaN)
                ));

        Map<String, Object> response =
                service.generateActions("person@example.com");

        assertEquals(125.5, response.get("totalEmission"));
        assertEquals(2, response.get("categoryCount"));
        assertEquals("RULE_BASED_SCENARIO_ESTIMATE", response.get("method"));

        List<?> hotspots = (List<?>) response.get("hotspots");
        Map<?, ?> firstHotspot = (Map<?, ?>) hotspots.get(0);
        assertEquals("TRANSPORTATION", firstHotspot.get("category"));
        assertEquals(90.5, firstHotspot.get("emission"));
        assertEquals(72.11, firstHotspot.get("share"));

        List<?> recommendations = (List<?>) response.get("recommendations");
        Map<?, ?> firstRecommendation = (Map<?, ?>) recommendations.get(0);
        assertEquals("transport-public", firstRecommendation.get("id"));
        assertEquals(9.05, firstRecommendation.get("estimatedSaving"));
        assertEquals(10.0, firstRecommendation.get("estimatedSavingRate"));
        assertEquals(
                "ILLUSTRATIVE_SCENARIO",
                firstRecommendation.get("estimateType")
        );

        verify(activityRepository)
                .findByUserOrderByActivityDateDesc(user);
    }

    @Test
    void returnsEmptyResultsWhenUserHasNoActivities() {
        when(userRepository.findByEmailIgnoreCase("person@example.com"))
                .thenReturn(Optional.of(user));
        when(activityRepository.findByUserOrderByActivityDateDesc(user))
                .thenReturn(List.of());

        Map<String, Object> response =
                service.generateActions("person@example.com");

        assertEquals(0.0, response.get("totalEmission"));
        assertEquals(0, response.get("categoryCount"));
        assertEquals(List.of(), response.get("hotspots"));
        assertEquals(List.of(), response.get("recommendations"));
    }

    @Test
    void rejectsAnEmailThatDoesNotResolveToAUser() {
        when(userRepository.findByEmailIgnoreCase("missing@example.com"))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> service.generateActions("missing@example.com")
        );

        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(activityRepository, never())
                .findByUserOrderByActivityDateDesc(user);
    }

    private Activity activity(String category, double emission) {
        Activity activity = new Activity();
        activity.setCategory(category);
        activity.setEmission(emission);
        return activity;
    }
}
