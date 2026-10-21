package com.ecotrack.backend.environment;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class EnvironmentalConfiguration {

    @Bean
    public RestClient.Builder environmentalRestClientBuilder() {
        return RestClient.builder();
    }
}
