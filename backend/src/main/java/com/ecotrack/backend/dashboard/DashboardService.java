package com.ecotrack.backend.dashboard;

import java.time.YearMonth;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.stereotype.Service;

import com.ecotrack.backend.activity.ActivityRepository;
import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;

@Service
public class DashboardService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public DashboardService(
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    public DashboardResponse getDashboard(String email) {

        User user = userRepository
                .findByEmail(email)
                .orElseThrow(
                        () -> new RuntimeException("User not found")
                );

        // =========================================
        // GET USER ACTIVITIES
        // =========================================

        List<Activity> activities =
                activityRepository
                        .findByUserOrderByActivityDateDesc(user);


        // =========================================
        // TOTAL CARBON EMISSION
        // =========================================

        double totalEmission =
                activities
                        .stream()
                        .mapToDouble(
                                activity -> activity.getEmission() == null
                                        ? 0.0
                                        : activity.getEmission()
                        )
                        .sum();


        // =========================================
        // CATEGORY-WISE EMISSIONS
        // =========================================

        Map<String, Double> categoryEmissions =
                new LinkedHashMap<>();

        for (Activity activity : activities) {

            String category = activity.getCategory();

            if (category == null) {
                category = "OTHER";
            }

            double emission =
                    activity.getEmission() == null
                            ? 0.0
                            : activity.getEmission();

            categoryEmissions.put(
                    category,
                    categoryEmissions.getOrDefault(
                            category,
                            0.0
                    ) + emission
            );
        }


        // =========================================
        // MONTHLY EMISSIONS
        // =========================================

        Map<YearMonth, Double> monthlyMap =
                new TreeMap<>();

        for (Activity activity : activities) {

            if (activity.getActivityDate() == null) {
                continue;
            }

            YearMonth month =
                    YearMonth.from(
                            activity.getActivityDate()
                    );

            double emission =
                    activity.getEmission() == null
                            ? 0.0
                            : activity.getEmission();

            monthlyMap.put(
                    month,
                    monthlyMap.getOrDefault(
                            month,
                            0.0
                    ) + emission
            );
        }


        List<MonthlyEmission> monthlyEmissions =
                new ArrayList<>();

        for (
                Map.Entry<YearMonth, Double> entry
                        : monthlyMap.entrySet()
        ) {

            monthlyEmissions.add(
                    new MonthlyEmission(
                            entry.getKey().toString(),
                            round(entry.getValue())
                    )
            );
        }


        // =========================================
        // SUSTAINABILITY SCORE
        // =========================================

        double sustainabilityScore =
                calculateScore(totalEmission);


        // =========================================
        // CO2 REDUCED
        // =========================================

        double co2Reduced =
                calculateCo2Reduced(totalEmission);


        // =========================================
        // GOAL PROGRESS
        // =========================================

        double goalProgress =
                calculateGoalProgress(totalEmission);


        // =========================================
        // RESPONSE
        // =========================================

        return new DashboardResponse(
                round(totalEmission),
                round(sustainabilityScore),
                round(co2Reduced),
                round(goalProgress),
                categoryEmissions,
                monthlyEmissions
        );
    }


    // =========================================
    // SUSTAINABILITY SCORE
    // =========================================

    private double calculateScore(double emission) {

        if (emission <= 100) {
            return 95;
        }

        if (emission <= 200) {
            return 85;
        }

        if (emission <= 300) {
            return 75;
        }

        if (emission <= 400) {
            return 65;
        }

        if (emission <= 500) {
            return 55;
        }

        return 40;
    }


    // =========================================
    // CO2 REDUCED
    // =========================================

    private double calculateCo2Reduced(double emission) {

        double baseline = 500;

        return Math.max(
                0,
                baseline - emission
        );
    }


    // =========================================
    // GOAL PROGRESS
    // =========================================

    private double calculateGoalProgress(double emission) {

        double target = 250;
        double baseline = 500;

        if (emission <= target) {
            return 100;
        }

        double progress =
                (
                        (baseline - emission)
                                /
                        (baseline - target)
                ) * 100;

        return Math.max(
                0,
                Math.min(
                        100,
                        progress
                )
        );
    }


    // =========================================
    // ROUND
    // =========================================

    private double round(double value) {

        return Math.round(
                value * 100
        ) / 100.0;
    }
}