package com.ecotrack.backend.activity;
import jakarta.validation.constraints.*; import java.time.LocalDate;
public final class ActivityDtos{public record CreateActivityRequest(@NotBlank String category,@NotBlank String activityType,@Positive double quantity,@NotBlank String unit,@NotNull LocalDate activityDate,String metadata){} public record ActivityResponse(Long id,String category,String activityType,double quantity,String unit,double emission,LocalDate activityDate,String factorVersion){}}
