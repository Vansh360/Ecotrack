package com.ecotrack.backend.dashboard;

import java.util.Map;
import java.util.List;

public class DashboardResponse {

    private double totalEmission;

    private double sustainabilityScore;

    private double co2Reduced;

    private double goalProgress;

    private Map<String, Double> categoryEmissions;

    private List<MonthlyEmission> monthlyEmissions;


    public DashboardResponse() {
    }


    public DashboardResponse(
            double totalEmission,
            double sustainabilityScore,
            double co2Reduced,
            double goalProgress,
            Map<String, Double> categoryEmissions,
            List<MonthlyEmission> monthlyEmissions
    ) {

        this.totalEmission = totalEmission;
        this.sustainabilityScore =
                sustainabilityScore;
        this.co2Reduced = co2Reduced;
        this.goalProgress = goalProgress;
        this.categoryEmissions =
                categoryEmissions;
        this.monthlyEmissions =
                monthlyEmissions;
    }


    public double getTotalEmission() {
        return totalEmission;
    }


    public double getSustainabilityScore() {
        return sustainabilityScore;
    }


    public double getCo2Reduced() {
        return co2Reduced;
    }


    public double getGoalProgress() {
        return goalProgress;
    }


    public Map<String, Double>
    getCategoryEmissions() {
        return categoryEmissions;
    }


    public List<MonthlyEmission>
    getMonthlyEmissions() {
        return monthlyEmissions;
    }
}