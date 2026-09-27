package com.glowguide.exception;

/** Thrown when an authenticated user tries to act on a resource they do not own or lack the role for. */
public class UnauthorizedActionException extends RuntimeException {
    public UnauthorizedActionException(String message) {
        super(message);
    }
}
