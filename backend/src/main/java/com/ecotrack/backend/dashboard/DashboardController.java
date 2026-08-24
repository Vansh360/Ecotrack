package com.ecotrack.backend.dashboard;

import org.springframework.security.core.Authentication;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class DashboardController {

    private final DashboardService dashboardService;


    public DashboardController(
            DashboardService dashboardService
    ) {

        this.dashboardService =
                dashboardService;
    }


    @GetMapping
    public DashboardResponse getDashboard(
            Authentication authentication
    ) {

        String email =
                authentication.getName();


        return dashboardService
                .getDashboard(email);
    }
}