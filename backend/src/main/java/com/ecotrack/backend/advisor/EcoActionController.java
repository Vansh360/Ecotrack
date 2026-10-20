package com.ecotrack.backend.advisor;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eco-actions")
public class EcoActionController {

    private final EcoActionService ecoActionService;

    public EcoActionController(EcoActionService ecoActionService) {
        this.ecoActionService = ecoActionService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getActions(
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                ecoActionService.generateActions(authentication.getName())
        );
    }
}
