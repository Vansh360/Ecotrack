package com.ecotrack.backend.simulation;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/simulations")
public class WhatIfSimulationController {

    private final WhatIfSimulationService simulationService;

    public WhatIfSimulationController(WhatIfSimulationService simulationService) {
        this.simulationService = simulationService;
    }

    @PostMapping("/what-if")
    public WhatIfSimulationDtos.Response simulate(
            @Valid @RequestBody WhatIfSimulationDtos.Request request
    ) {
        return simulationService.simulate(request);
    }
}
