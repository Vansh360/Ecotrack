package com.ecotrack.backend.activity;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public final class ActivityDtos {

    private ActivityDtos() {
    }

    // =====================================================
    // CREATE ACTIVITY REQUEST
    // =====================================================

    public record CreateActivityRequest(

            @NotBlank
            String category,

            @NotBlank
            String activityType,

            @NotNull
            @Positive
            Double quantity,

            @NotBlank
            String unit,

            LocalDate activityDate,

            String metadata
    ) {
    }

    // =====================================================
    // ACTIVITY RESPONSE
    // =====================================================

    public record ActivityResponse(

            Long id,

            String category,

            String activityType,

            Double quantity,

            String unit,

            Double emission,

            LocalDate activityDate,

            String emissionFactorVersion
    ) {
    }
}