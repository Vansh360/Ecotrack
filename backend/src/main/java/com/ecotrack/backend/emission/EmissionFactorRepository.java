package com.ecotrack.backend.emission;
import org.springframework.data.jpa.repository.JpaRepository; import java.util.*;
public interface EmissionFactorRepository extends JpaRepository<EmissionFactor,Long>{Optional<EmissionFactor> findFirstByCategoryAndActivityTypeAndActiveTrueOrderByIdDesc(String category,String activityType);List<EmissionFactor> findByCategoryOrderByActivityType(String category);}
