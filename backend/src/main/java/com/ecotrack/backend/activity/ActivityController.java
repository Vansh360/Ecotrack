package com.ecotrack.backend.activity;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ecotrack.backend.entity.Activity;

@RestController
@RequestMapping("/api/activities")
@CrossOrigin(
        origins = "http://localhost:5173"
)
public class ActivityController {

    private final ActivityService service;


    public ActivityController(
            ActivityService service
    ) {
        this.service = service;
    }


    @GetMapping
    public ResponseEntity<List<Activity>>
    getActivities() {

        return ResponseEntity.ok(
                service.getAllActivities()
        );
    }


    @GetMapping("/{id}")
    public ResponseEntity<Activity>
    getActivity(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                service.getActivityById(id)
        );
    }


    @PostMapping
    public ResponseEntity<Activity>
    createActivity(
            @RequestBody Activity activity
    ) {

        Activity saved =
                service.createActivity(
                        activity
                );

        return ResponseEntity
                .status(
                        HttpStatus.CREATED
                )
                .body(saved);
    }


    @PutMapping("/{id}")
    public ResponseEntity<Activity>
    updateActivity(
            @PathVariable Long id,
            @RequestBody Activity activity
    ) {

        return ResponseEntity.ok(
                service.updateActivity(
                        id,
                        activity
                )
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void>
    deleteActivity(
            @PathVariable Long id
    ) {

        service.deleteActivity(id);

        return ResponseEntity
                .noContent()
                .build();
    }
}