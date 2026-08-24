package com.ecotrack.backend.entity;

import com.ecotrack.backend.user.User;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "user_id",
            nullable = false
    )
    private User user;

    @Column(nullable = false)
    private String category;

    private String activityType;

    private Double quantity;

    private String unit;

    @Column(nullable = false)
    private Double emission;

    private Double emissionFactor;

    private String emissionFactorUnit;

    private String factorSource;

    private String factorRegion;

    private Integer factorYear;

    private String calculationBoundary;

    private String details;

    private LocalDateTime date;

    private LocalDateTime createdAt;


    public Activity() {
    }


    @PrePersist
    protected void onCreate() {

        if (date == null) {
            date = LocalDateTime.now();
        }

        createdAt = LocalDateTime.now();
    }


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
        this.emissionFactorUnit =
                emissionFactorUnit;
    }


    public String getFactorSource() {
        return factorSource;
    }


    public void setFactorSource(
            String factorSource
    ) {
        this.factorSource =
                factorSource;
    }


    public String getFactorRegion() {
        return factorRegion;
    }


    public void setFactorRegion(
            String factorRegion
    ) {
        this.factorRegion =
                factorRegion;
    }


    public Integer getFactorYear() {
        return factorYear;
    }


    public void setFactorYear(
            Integer factorYear
    ) {
        this.factorYear =
                factorYear;
    }


    public String getCalculationBoundary() {
        return calculationBoundary;
    }


    public void setCalculationBoundary(
            String calculationBoundary
    ) {
        this.calculationBoundary =
                calculationBoundary;
    }


    public String getDetails() {
        return details;
    }


    public void setDetails(String details) {
        this.details = details;
    }


    public LocalDateTime getDate() {
        return date;
    }


    public void setDate(LocalDateTime date) {
        this.date = date;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }
}