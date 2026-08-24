package com.ecotrack.backend.activity;

import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.activity.ActivityRepository;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;
import com.ecotrack.backend.emission.EmissionFactorRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

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


    public List<Activity> getAllActivities() {

        return repository
                .findAllByOrderByDateDesc();
    }


    public Activity getActivityById(
            Long id
    ) {

        return repository
                .findById(id)
                .orElseThrow(
                    () -> new RuntimeException(
                        "Activity not found"
                    )
                );
    }


    public Activity createActivity(
            Activity activity
    ) {

        return repository.save(
                activity
        );
    }


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
                updatedActivity
                        .getActivityType()
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
                updatedActivity
                        .getEmissionFactor()
        );

        existing.setEmissionFactorUnit(
                updatedActivity
                        .getEmissionFactorUnit()
        );

        existing.setFactorSource(
                updatedActivity
                        .getFactorSource()
        );

        existing.setFactorRegion(
                updatedActivity
                        .getFactorRegion()
        );

        existing.setFactorYear(
                updatedActivity
                        .getFactorYear()
        );

        existing.setCalculationBoundary(
                updatedActivity
                        .getCalculationBoundary()
        );

        existing.setDetails(
                updatedActivity.getDetails()
        );

        return repository.save(
                existing
        );
    }


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

    public ActivityDtos.ActivityResponse create(
            String email,
            ActivityDtos.CreateActivityRequest request
    ) {
        // Get user by email
        User user = userRepository
                .findByEmailIgnoreCase(email)
                .orElseThrow(
                    () -> new RuntimeException(
                        "User not found"
                    )
                );

        // Get emission factor
        var emissionFactor = emissionFactorRepository
                .findFirstByCategoryAndActivityTypeAndActiveTrueOrderByIdDesc(
                    request.category().toUpperCase(),
                    request.activityType().toUpperCase()
                )
                .orElseThrow(
                    () -> new RuntimeException(
                        "Emission factor not found for " +
                        request.category() + " - " +
                        request.activityType()
                    )
                );

        // Calculate emission
        double emission = request.quantity() * emissionFactor.getFactor();

        // Create activity
        Activity activity = new Activity();
        activity.setUser(user);
        activity.setCategory(request.category().toUpperCase());
        activity.setActivityType(request.activityType().toUpperCase());
        activity.setQuantity(request.quantity());
        activity.setUnit(request.unit());
        activity.setEmission(emission);
        activity.setEmissionFactor(emissionFactor.getFactor());
        activity.setEmissionFactorUnit(emissionFactor.getUnit());
        activity.setFactorSource(emissionFactor.getSource());
        activity.setFactorRegion(emissionFactor.getRegion());
        activity.setFactorYear(2024);
        activity.setDetails(request.metadata());
        activity.setDate(
            LocalDateTime.of(
                request.activityDate(),
                java.time.LocalTime.now()
            )
        );

        Activity saved = repository.save(activity);

        return new ActivityDtos.ActivityResponse(
            saved.getId(),
            saved.getCategory(),
            saved.getActivityType(),
            saved.getQuantity(),
            saved.getUnit(),
            saved.getEmission(),
            request.activityDate(),
            emissionFactor.getVersion()
        );
    }
}