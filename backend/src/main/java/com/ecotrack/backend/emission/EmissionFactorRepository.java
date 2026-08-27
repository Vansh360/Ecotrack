package com.ecotrack.backend.emission;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmissionFactorRepository
        extends JpaRepository<EmissionFactor, Long> {

    // Used by ActivityService
    Optional<EmissionFactor>
    findFirstByCategoryIgnoreCaseAndActivityTypeIgnoreCaseAndActiveTrueOrderByIdDesc(
            String category,
            String activityType
    );

    // Used by SimulationService
    Optional<EmissionFactor>
    findFirstByCategoryAndActivityTypeAndActiveTrueOrderByIdDesc(
            String category,
            String activityType
    );
}