package com.ecotrack.backend.activity;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(origins = "http://localhost:5173")
public class ActivityController {

    private final ActivityService service;

    public ActivityController(ActivityService service) {
        this.service = service;
    }


    // =====================================================
    // GET ALL ACTIVITIES
    // =====================================================

    @GetMapping
    public ResponseEntity<List<ActivityDtos.ActivityResponse>>
    getActivities(Authentication authentication) {

        return ResponseEntity.ok(
                service.getAllActivityResponses(
                        authentication.getName()
                )
        );
    }


    // =====================================================
    // CREATE ACTIVITY
    // =====================================================

    @PostMapping
    public ResponseEntity<ActivityDtos.ActivityResponse>
    createActivity(
            @Valid @RequestBody ActivityDtos.CreateActivityRequest request,
            Authentication authentication
    ) {

        ActivityDtos.ActivityResponse response =
                service.create(
                        authentication.getName(),
                        request
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =====================================================
    // UPDATE ACTIVITY
    // =====================================================

    @PutMapping("/{id}")
    public ResponseEntity<ActivityDtos.ActivityResponse>
    updateActivity(
            @PathVariable Long id,
            @Valid @RequestBody ActivityDtos.CreateActivityRequest request,
            Authentication authentication
    ) {

        ActivityDtos.ActivityResponse response =
                service.update(
                        id,
                        authentication.getName(),
                        request
                );

        return ResponseEntity.ok(response);
    }


    // =====================================================
    // DELETE ACTIVITY
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id,
            Authentication authentication
    ) {

        service.deleteActivity(id, authentication.getName());

        return ResponseEntity
                .noContent()
                .build();
    }
}