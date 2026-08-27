package com.ecotrack.backend.activity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
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
    // GET ALL ACTIVITIES FOR CURRENT USER
    // =====================================================

    public List<ActivityDtos.ActivityResponse> getAllActivityResponses(
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        return repository
                .findByUserOrderByDateDesc(user)
                .stream()
                .map(activity ->
                        new ActivityDtos.ActivityResponse(
                                activity.getId(),
                                activity.getCategory(),
                                activity.getActivityType(),
                                activity.getQuantity(),
                                activity.getUnit(),
                                activity.getEmission(),
                                activity.getDate() != null
                                        ? activity.getDate().toLocalDate()
                                        : null,
                                null
                        )
                )
                .toList();
    }

    // =====================================================
    // GET ACTIVITY BY ID
    // =====================================================

    public Activity getActivityById(Long id) {

        return repository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Activity not found")
                );
    }

    // =====================================================
    // GET OWNED ACTIVITY
    // =====================================================

    private Activity getOwnedActivity(
            Long id,
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        Activity activity = repository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Activity not found")
                );

        if (
                activity.getUser() == null ||
                activity.getUser().getId() == null ||
                !activity.getUser().getId().equals(user.getId())
        ) {

            throw new RuntimeException(
                    "You do not have permission to access this activity"
            );
        }

        return activity;
    }

    // =====================================================
    // CREATE - ENTITY BASED
    // =====================================================

    public Activity createActivity(
            Activity activity,
            String email
    ) {

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        activity.setUser(user);

        /*
         * IMPORTANT:
         * activity_date is NOT NULL in PostgreSQL.
         * Therefore always make sure date has a value.
         */
        if (activity.getDate() == null) {
            activity.setDate(LocalDateTime.now());
        }

        return repository.save(activity);
    }

    // =====================================================
    // CREATE - DTO BASED
    // =====================================================

    public ActivityDtos.ActivityResponse create(
            String email,
            ActivityDtos.CreateActivityRequest request
    ) {

        // -------------------------------------------------
        // 1. Find logged-in user
        // -------------------------------------------------

        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        // -------------------------------------------------
        // 2. Validate request
        // -------------------------------------------------

        if (request.category() == null ||
                request.category().isBlank()) {

            throw new IllegalArgumentException(
                    "Category is required"
            );
        }

        if (request.activityType() == null ||
                request.activityType().isBlank()) {

            throw new IllegalArgumentException(
                    "Activity type is required"
            );
        }

        if (request.quantity() == null ||
                request.quantity() <= 0) {

            throw new IllegalArgumentException(
                    "Quantity must be greater than 0"
            );
        }

        if (request.unit() == null ||
                request.unit().isBlank()) {

            throw new IllegalArgumentException(
                    "Unit is required"
            );
        }

        // -------------------------------------------------
        // 3. Find emission factor
        // -------------------------------------------------

        var emissionFactor =
                emissionFactorRepository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                request.category(),
                                request.activityType()
                        )
                        .orElseThrow(
                                () -> new EmissionFactorNotFoundException(
                                        "Emission factor not found for "
                                                + request.category()
                                                + " - "
                                                + request.activityType()
                                )
                        );

        // -------------------------------------------------
        // 4. Calculate emission
        // -------------------------------------------------

        double emission =
                request.quantity()
                        * emissionFactor.getFactor();

        // -------------------------------------------------
        // 5. Determine activity date
        // -------------------------------------------------

        LocalDate activityDate =
                request.activityDate() != null
                        ? request.activityDate()
                        : LocalDate.now();

        LocalDateTime activityDateTime =
                LocalDateTime.of(
                        activityDate,
                        LocalTime.now()
                );

        // -------------------------------------------------
        // 6. Create Activity
        // -------------------------------------------------

        Activity activity = new Activity();

        // User
        activity.setUser(user);

        // Basic activity information
        activity.setCategory(
                request.category().toUpperCase()
        );

        activity.setActivityType(
                request.activityType().toUpperCase()
        );

        activity.setQuantity(
                request.quantity()
        );

        activity.setUnit(
                request.unit()
        );

        // -------------------------------------------------
        // VERY IMPORTANT
        // This fixes:
        // "null value in column activity_date"
        // -------------------------------------------------

        activity.setDate(activityDateTime);

        // -------------------------------------------------
        // 7. Emission information
        // -------------------------------------------------

        activity.setEmission(emission);

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

        /*
         * If your EmissionFactor entity has a year field,
         * use that instead of hardcoding 2024.
         */
        activity.setFactorYear(2024);

        // Metadata/details
        activity.setDetails(
                request.metadata()
        );

        // -------------------------------------------------
        // 8. SAVE TO DATABASE
        // -------------------------------------------------

        Activity saved =
                repository.save(activity);

        // -------------------------------------------------
        // 9. RETURN RESPONSE
        // -------------------------------------------------

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
    // UPDATE
    // =====================================================

    public ActivityDtos.ActivityResponse update(
            Long id,
            String email,
            ActivityDtos.CreateActivityRequest request
    ) {

        // -------------------------------------------------
        // 1. Find owned activity
        // -------------------------------------------------

        Activity existing =
                getOwnedActivity(id, email);

        // -------------------------------------------------
        // 2. Find emission factor
        // -------------------------------------------------

        var emissionFactor =
                emissionFactorRepository
                        .findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
                                request.category(),
                                request.activityType()
                        )
                        .orElseThrow(
                                () -> new EmissionFactorNotFoundException(
                                        "Emission factor not found for "
                                                + request.category()
                                                + " - "
                                                + request.activityType()
                                )
                        );

        // -------------------------------------------------
        // 3. Calculate emission
        // -------------------------------------------------

        double emission =
                request.quantity()
                        * emissionFactor.getFactor();

        // -------------------------------------------------
        // 4. Update fields
        // -------------------------------------------------

        existing.setCategory(
                request.category().toUpperCase()
        );

        existing.setActivityType(
                request.activityType().toUpperCase()
        );

        existing.setQuantity(
                request.quantity()
        );

        existing.setUnit(
                request.unit()
        );

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

        existing.setFactorYear(2024);

        existing.setDetails(
                request.metadata()
        );

        // -------------------------------------------------
        // 5. Update date
        // -------------------------------------------------

        LocalDate activityDate =
                request.activityDate() != null
                        ? request.activityDate()
                        : existing.getDate() != null
                                ? existing.getDate().toLocalDate()
                                : LocalDate.now();

        existing.setDate(
                LocalDateTime.of(
                        activityDate,
                        LocalTime.now()
                )
        );

        // -------------------------------------------------
        // 6. Save
        // -------------------------------------------------

        Activity saved =
                repository.save(existing);

        // -------------------------------------------------
        // 7. Return
        // -------------------------------------------------

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
    // DELETE
    // =====================================================

    public void deleteActivity(
            Long id,
            String email
    ) {

        Activity activity =
                getOwnedActivity(id, email);

        repository.delete(activity);
    }
}