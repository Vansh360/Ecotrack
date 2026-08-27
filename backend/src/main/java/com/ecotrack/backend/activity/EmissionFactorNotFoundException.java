package com.ecotrack.backend.activity;

public class EmissionFactorNotFoundException extends RuntimeException {
    public EmissionFactorNotFoundException(String message) {
        super(message);
    }
}