package com.glowguide.service;

public class EmailDeliveryUnavailableException extends RuntimeException {
    public EmailDeliveryUnavailableException() {
        super("Email delivery is not available");
    }
}
