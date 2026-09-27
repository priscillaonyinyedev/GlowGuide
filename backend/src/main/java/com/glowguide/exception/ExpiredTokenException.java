package com.glowguide.exception;

/** Thrown when an email-verification or password-reset token is expired or already used. */
public class ExpiredTokenException extends RuntimeException {
    public ExpiredTokenException(String message) {
        super(message);
    }
}
