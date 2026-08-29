package com.ecotrack.backend.entity;

import java.time.LocalDateTime;

import com.ecotrack.backend.user.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================
    // USER
    // =========================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
        name = "user_id",
        nullable = false
    )
    private User user;


    // =========================
    // ACTIVITY INFORMATION
    // =========================

    @Column(
        name = "category",
        nullable = false
    )
    private String category;

    @Column(name = "activity_type")
    private String activityType;

    @Column(name = "quantity")
    private Double quantity;

    @Column(name = "unit")
    private String unit;


    // =========================
    // EMISSION
    // =========================

    @Column(
        name = "emission",
        nullable = false
    )
    private Double emission;

    @Column(name = "emission_factor")
    private Double emissionFactor;

    @Column(name = "emission_factor_unit")
    private String emissionFactorUnit;

    @Column(name = "factor_source")
    private String factorSource;

    @Column(name = "factor_region")
    private String factorRegion;

    @Column(name = "factor_year")
    private Integer factorYear;

    @Column(name = "calculation_boundary")
    private String calculationBoundary;

    @Column(name = "details")
    private String details;


    // =========================
    // DATES
    // =========================

    @Column(
        name = "activity_date",
        nullable = false
    )
    private LocalDateTime activityDate;

    @Column(
        name = "created_at",
        nullable = false
    )
    private LocalDateTime createdAt;


    // =========================
    // CONSTRUCTOR
    // =========================

    public Activity() {
    }


    // =========================
    // BEFORE INSERT
    // =========================

    @PrePersist
    protected void onCreate() {

        if (activityDate == null) {
            activityDate = LocalDateTime.now();
        }

        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }


    // =========================
    // GETTERS AND SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }


    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }


    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }


    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }


    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }


    public Double getEmission() {
        return emission;
    }

    public void setEmission(Double emission) {
        this.emission = emission;
    }


    public Double getEmissionFactor() {
        return emissionFactor;
    }

    public void setEmissionFactor(Double emissionFactor) {
        this.emissionFactor = emissionFactor;
    }


    public String getEmissionFactorUnit() {
        return emissionFactorUnit;
    }

    public void setEmissionFactorUnit(
        String emissionFactorUnit
    ) {
        this.emissionFactorUnit = emissionFactorUnit;
    }


    public String getFactorSource() {
        return factorSource;
    }

    public void setFactorSource(
        String factorSource
    ) {
        this.factorSource = factorSource;
    }


    public String getFactorRegion() {
        return factorRegion;
    }

    public void setFactorRegion(
        String factorRegion
    ) {
        this.factorRegion = factorRegion;
    }


    public Integer getFactorYear() {
        return factorYear;
    }

    public void setFactorYear(
        Integer factorYear
    ) {
        this.factorYear = factorYear;
    }


    public String getCalculationBoundary() {
        return calculationBoundary;
    }

    public void setCalculationBoundary(
        String calculationBoundary
    ) {
        this.calculationBoundary = calculationBoundary;
    }


    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }


    // =========================
    // ACTIVITY DATE
    // =========================

    public LocalDateTime getActivityDate() {
        return activityDate;
    }

    public void setActivityDate(
        LocalDateTime activityDate
    ) {
        this.activityDate = activityDate;
    }


    // =========================
    // CREATED DATE
    // =========================

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
        LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}