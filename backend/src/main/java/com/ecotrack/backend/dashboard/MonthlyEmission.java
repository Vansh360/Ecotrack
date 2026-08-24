package com.ecotrack.backend.dashboard;

public class MonthlyEmission {

    private String month;

    private double emission;


    public MonthlyEmission(
            String month,
            double emission
    ) {

        this.month = month;
        this.emission = emission;
    }


    public String getMonth() {
        return month;
    }


    public double getEmission() {
        return emission;
    }
}