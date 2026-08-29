package com.ecotrack.backend.activity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ecotrack.backend.emission.EmissionFactorRepository;
import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;

@Service
public class ActivityService {

    private final ActivityRepository repository;
    private final UserRepository userRepository;
    private final EmissionFactorRepository emissionFactorRepository;

    public ActivityService(
            ActivityRepository repository,
            UserRepository userRepository,
            EmissionFactorRepository emissionFactorRepository
    ) {
        this.repository = repository;
        this.userRepository = userRepository;
        this.emissionFactorRepository = emissionFactorRepository;
    }


    // =====================================================
    // GET ALL ACTIVITIES FOR LOGGED-IN USER
    // =====================================================

    public List<Activity> getAllActivities(String email) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return repository.findByUserOrderByActivityDateDesc(user);
    }


    // =====================================================
    // GET ALL ACTIVITIES AS SAFE DTOs
    // =====================================================

    public List<ActivityDtos.ActivityResponse> getAllActivityResponses(
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return repository.findByUserOrderByActivityDateDesc(user)
                .stream()
                .map(activity -> {

                    LocalDate activityDate =
                            activity.getDate() != null
                                    ? activity.getDate().toLocalDate()
                                    : null;

                    return new ActivityDtos.ActivityResponse(
                            activity.getId(),
                            activity.getCategory(),
                            activity.getActivityType(),
                            activity.getQuantity(),
                            activity.getUnit(),
                            activity.getEmission(),
                            activityDate,
                            null
                    );
                })
                .toList();
    }


    // =====================================================
    // GET ACTIVITY BY ID
    // =====================================================

    public Activity getActivityById(Long id) {

        return repository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Activity not found"
                        )
                );
    }


    // =====================================================
    // GET ACTIVITY AND VERIFY OWNERSHIP
    // =====================================================

    private Activity getOwnedActivity(
            Long id,
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        Activity activity = repository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Activity not found"
                        )
                );

        if (
                activity.getUser() == null ||
                activity.getUser().getId() == null ||
                !activity.getUser()
                        .getId()
                        .equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You do not have permission to access this activity"
            );
        }

        return activity;
    }


    // =====================================================
    // CREATE ACTIVITY - ENTITY VERSION
    // Kept for compatibility
    // =====================================================

    public Activity createActivity(
            Activity activity,
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );

        activity.setUser(user);

        if (activity.getDate() == null) {
            activity.setDate(
                    LocalDateTime.now()
            );
        }

        return repository.save(activity);
    }


    // =====================================================
    // CREATE ACTIVITY - DTO VERSION
    // =====================================================

    public ActivityDtos.ActivityResponse create(
            String email,
            ActivityDtos.CreateActivityRequest request
    ) {

        // -----------------------------------------
        // 1. Find logged-in user
        // -----------------------------------------

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException(
                                "User not found"
                        )
                );


        // -----------------------------------------
        // 2. Validate category and activity type
        // -----------------------------------------

        String category =
                request.category()
                        .trim()
                        .toUpperCase();

        String activityType =
                request.activityType()
                        .trim()
                        .toUpperCase();


        // -----------------------------------------
        // 3. Find emission factor
        // -----------------------------------------

        var emissionFactor =
                emissionFactorRepository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                category,
                                activityType
                        )
                        .orElseThrow(
                                () ->
                                        new EmissionFactorNotFoundException(
                                                "Emission factor not found for "
                                                        + category
                                                        + " - "
                                                        + activityType
                                        )
                        );


        // -----------------------------------------
        // 4. Calculate emission
        // -----------------------------------------

        double emission =
                request.quantity()
                        * emissionFactor.getFactor();


        // -----------------------------------------
        // 5. Create Activity entity
        // -----------------------------------------

        Activity activity =
                new Activity();


        activity.setUser(user);

        activity.setCategory(
                category
        );

        activity.setActivityType(
                activityType
        );

        activity.setQuantity(
                request.quantity()
        );

        activity.setUnit(
                request.unit()
        );


        // -----------------------------------------
        // 6. Activity date
        // -----------------------------------------

        LocalDate activityDate =
                request.activityDate() != null
                        ? request.activityDate()
                        : LocalDate.now();


        activity.setDate(
                activityDate.atStartOfDay()
        );


        // -----------------------------------------
        // 7. Emission information
        // -----------------------------------------

        activity.setEmission(
                emission
        );

        activity.setEmissionFactor(
                emissionFactor.getFactor()
        );

        activity.setEmissionFactorUnit(
                emissionFactor.getUnit()
        );

        activity.setFactorSource(
                emissionFactor.getSource()
        );

        activity.setFactorRegion(
                emissionFactor.getRegion()
        );

        activity.setFactorYear(
                2024
        );


        // -----------------------------------------
        // 8. Additional details
        // -----------------------------------------

        activity.setDetails(
                request.metadata()
        );


        // -----------------------------------------
        // 9. Save to Neon PostgreSQL
        // -----------------------------------------

        Activity saved =
                repository.save(activity);


        // -----------------------------------------
        // 10. Return response
        // -----------------------------------------

        return new ActivityDtos.ActivityResponse(
                saved.getId(),
                saved.getCategory(),
                saved.getActivityType(),
                saved.getQuantity(),
                saved.getUnit(),
                saved.getEmission(),
                saved.getDate() != null
                        ? saved.getDate().toLocalDate()
                        : activityDate,
                emissionFactor.getVersion()
        );
    }


    // =====================================================
    // UPDATE ACTIVITY - DTO VERSION
    // =====================================================

    public ActivityDtos.ActivityResponse update(
            Long id,
            String email,
            ActivityDtos.CreateActivityRequest request
    ) {

        // -----------------------------------------
        // 1. Verify ownership
        // -----------------------------------------

        Activity existing =
                getOwnedActivity(
                        id,
                        email
                );


        // -----------------------------------------
        // 2. Normalize values
        // -----------------------------------------

        String category =
                request.category()
                        .trim()
                        .toUpperCase();

        String activityType =
                request.activityType()
                        .trim()
                        .toUpperCase();


        // -----------------------------------------
        // 3. Get latest emission factor
        // -----------------------------------------

        var emissionFactor =
                emissionFactorRepository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                category,
                                activityType
                        )
                        .orElseThrow(
                                () ->
                                        new EmissionFactorNotFoundException(
                                                "Emission factor not found for "
                                                        + category
                                                        + " - "
                                                        + activityType
                                        )
                        );


        // -----------------------------------------
        // 4. Recalculate emission
        // -----------------------------------------

        double emission =
                request.quantity()
                        * emissionFactor.getFactor();


        // -----------------------------------------
        // 5. Update basic information
        // -----------------------------------------

        existing.setCategory(
                category
        );

        existing.setActivityType(
                activityType
        );

        existing.setQuantity(
                request.quantity()
        );

        existing.setUnit(
                request.unit()
        );


        // -----------------------------------------
        // 6. Update date
        // -----------------------------------------

        LocalDate activityDate;

        if (request.activityDate() != null) {

            activityDate =
                    request.activityDate();

        } else if (existing.getDate() != null) {

            activityDate =
                    existing.getDate()
                            .toLocalDate();

        } else {

            activityDate =
                    LocalDate.now();
        }


        existing.setDate(
                activityDate.atStartOfDay()
        );


        // -----------------------------------------
        // 7. Update emission
        // -----------------------------------------

        existing.setEmission(
                emission
        );

        existing.setEmissionFactor(
                emissionFactor.getFactor()
        );

        existing.setEmissionFactorUnit(
                emissionFactor.getUnit()
        );

        existing.setFactorSource(
                emissionFactor.getSource()
        );

        existing.setFactorRegion(
                emissionFactor.getRegion()
        );

        existing.setFactorYear(
                2024
        );


        // -----------------------------------------
        // 8. Update metadata
        // -----------------------------------------

        existing.setDetails(
                request.metadata()
        );


        // -----------------------------------------
        // 9. Save
        // -----------------------------------------

        Activity saved =
                repository.save(existing);


        // -----------------------------------------
        // 10. Return response
        // -----------------------------------------

        return new ActivityDtos.ActivityResponse(
                saved.getId(),
                saved.getCategory(),
                saved.getActivityType(),
                saved.getQuantity(),
                saved.getUnit(),
                saved.getEmission(),
                saved.getDate() != null
                        ? saved.getDate().toLocalDate()
                        : activityDate,
                emissionFactor.getVersion()
        );
    }


    // =====================================================
    // UPDATE ACTIVITY - ENTITY VERSION
    // Kept for compatibility
    // =====================================================

    public Activity updateActivity(
            Long id,
            Activity updatedActivity
    ) {

        Activity existing =
                getActivityById(id);


        existing.setCategory(
                updatedActivity.getCategory()
        );

        existing.setActivityType(
                updatedActivity.getActivityType()
        );

        existing.setQuantity(
                updatedActivity.getQuantity()
        );

        existing.setUnit(
                updatedActivity.getUnit()
        );

        existing.setEmission(
                updatedActivity.getEmission()
        );

        existing.setEmissionFactor(
                updatedActivity.getEmissionFactor()
        );

        existing.setEmissionFactorUnit(
                updatedActivity.getEmissionFactorUnit()
        );

        existing.setFactorSource(
                updatedActivity.getFactorSource()
        );

        existing.setFactorRegion(
                updatedActivity.getFactorRegion()
        );

        existing.setFactorYear(
                updatedActivity.getFactorYear()
        );

        existing.setCalculationBoundary(
                updatedActivity.getCalculationBoundary()
        );

        existing.setDetails(
                updatedActivity.getDetails()
        );


        if (updatedActivity.getDate() != null) {

            existing.setDate(
                    updatedActivity.getDate()
            );
        }


        return repository.save(
                existing
        );
    }


    // =====================================================
    // DELETE ACTIVITY - OWNERSHIP CHECKED
    // =====================================================

    public void deleteActivity(
            Long id,
            String email
    ) {

        Activity activity =
                getOwnedActivity(
                        id,
                        email
                );

        repository.delete(activity);
    }


    // =====================================================
    // DELETE ACTIVITY - LEGACY VERSION
    // Kept for compatibility
    // =====================================================

    public void deleteActivity(
            Long id
    ) {

        if (!repository.existsById(id)) {

            throw new RuntimeException(
                    "Activity not found"
            );
        }

        repository.deleteById(id);
    }
}