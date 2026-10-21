package com.ecotrack.backend.advisor;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ecotrack.backend.activity.ActivityRepository;
import com.ecotrack.backend.entity.Activity;
import com.ecotrack.backend.user.User;
import com.ecotrack.backend.user.UserRepository;

@Service
public class EcoActionService {

    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    public EcoActionService(
            ActivityRepository activityRepository,
            UserRepository userRepository
    ) {
        this.activityRepository = activityRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Map<String, Object> generateActions(String email) {
        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        List<Activity> activities =
                activityRepository.findByUserOrderByActivityDateDesc(user);

        Map<String, Double> totals = new LinkedHashMap<>();

        for (Activity activity : activities) {
            String category = normalize(activity.getCategory());

            if (!isSupported(category)) {
                continue;
            }

            Double activityEmission = activity.getEmission();
            double emission = activityEmission == null
                    ? 0.0
                    : activityEmission;

            if (Double.isFinite(emission) && emission > 0) {
                totals.merge(category, emission, Double::sum);
            }
        }

        double totalEmission = totals.values()
                .stream()
                .mapToDouble(Double::doubleValue)
                .sum();

        List<Map<String, Object>> hotspots = new ArrayList<>();
        List<Map<String, Object>> recommendations = new ArrayList<>();

        totals.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue()
                        .reversed())
                .forEach(entry -> {
                    String category = entry.getKey();
                    double emission = entry.getValue();
                    double share = totalEmission > 0
                            ? emission / totalEmission * 100
                            : 0;

                    Map<String, Object> hotspot = new LinkedHashMap<>();
                    hotspot.put("category", category);
                    hotspot.put("emission", round(emission));
                    hotspot.put("share", round(share));
                    hotspots.add(hotspot);

                    addRecommendations(
                            recommendations,
                            category,
                            emission,
                            share
                    );
                });

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("totalEmission", round(totalEmission));
        response.put("categoryCount", totals.size());
        response.put("hotspots", hotspots);
        response.put("recommendations", recommendations);
        response.put("generatedAt", java.time.Instant.now().toString());
        response.put("method", "RULE_BASED_SCENARIO_ESTIMATE");

        return response;
    }

    private void addRecommendations(
            List<Map<String, Object>> output,
            String category,
            double emission,
            double share
    ) {
        switch (category) {
            case "TRANSPORTATION" -> {
                addAction(output, category, emission, share,
                        "transport-public",
                        "Compare public transport for suitable journeys",
                        "Compare bus or train with your usual journey.",
                        0.10);

                addAction(output, category, emission, share,
                        "transport-combine",
                        "Combine nearby errands",
                        "Plan nearby tasks together to avoid unnecessary trips.",
                        0.05);
            }

            case "ELECTRICITY" -> {
                addAction(output, category, emission, share,
                        "electricity-efficiency",
                        "Reduce unnecessary electricity use",
                        "Switch off unused lights and review appliance settings.",
                        0.05);

                addAction(output, category, emission, share,
                        "electricity-cooling",
                        "Review cooling settings",
                        "Use efficient cooling settings where practical.",
                        0.10);
            }

            case "FOOD" -> {
                addAction(output, category, emission, share,
                        "food-meal",
                        "Try a lower-emission meal",
                        "Compare a suitable plant-rich meal with your usual option.",
                        0.10);

                addAction(output, category, emission, share,
                        "food-waste",
                        "Prevent food waste",
                        "Plan portions and store food properly.",
                        0.05);
            }

            case "WASTE" -> {
                addAction(output, category, emission, share,
                        "waste-recycle",
                        "Separate recyclable materials",
                        "Follow local recycling and collection rules.",
                        0.05);

                addAction(output, category, emission, share,
                        "waste-reuse",
                        "Reuse suitable items",
                        "Use reusable bags and containers where practical.",
                        0.05);
            }

            case "WATER" -> {
                addAction(output, category, emission, share,
                        "water-saving",
                        "Reduce avoidable water use",
                        "Turn off taps when water is not needed.",
                        0.05);

                addAction(output, category, emission, share,
                        "water-reuse",
                        "Reuse suitable water safely",
                        "Reuse appropriate water for gardening or cleaning.",
                        0.05);
            }

            default -> {
            }
        }
    }

    private void addAction(
            List<Map<String, Object>> output,
            String category,
            double emission,
            double share,
            String id,
            String title,
            String description,
            double reductionRate
    ) {
        Map<String, Object> action = new LinkedHashMap<>();
        action.put("id", id);
        action.put("category", category);
        action.put("title", title);
        action.put("description", description);
        action.put("categoryEmission", round(emission));
        action.put("share", round(share));
        action.put("estimatedSaving", round(emission * reductionRate));
        action.put("estimatedSavingRate", reductionRate * 100);
        action.put("estimateType", "ILLUSTRATIVE_SCENARIO");
        output.add(action);
    }

    private String normalize(String value) {
        if (value == null) {
            return "";
        }

        String category = value.trim().toUpperCase(Locale.ROOT);

        if (category.contains("TRANSPORT") || category.contains("TRAVEL")) {
            return "TRANSPORTATION";
        }
        if (category.contains("ELECTRIC") || category.contains("ENERGY")) {
            return "ELECTRICITY";
        }
        if (category.contains("FOOD") || category.contains("MEAL")) {
            return "FOOD";
        }
        if (category.contains("WASTE") || category.contains("RECYCL")) {
            return "WASTE";
        }
        if (category.contains("WATER")) {
            return "WATER";
        }

        return category;
    }

    private boolean isSupported(String category) {
        return List.of(
                "TRANSPORTATION",
                "ELECTRICITY",
                "FOOD",
                "WASTE",
                "WATER"
        ).contains(category);
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
