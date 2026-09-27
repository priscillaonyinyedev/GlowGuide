package com.glowguide.controller;

import com.glowguide.dto.contact.ContactRequest;
import com.glowguide.dto.contact.NewsletterRequest;
import com.glowguide.service.ContactService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ContactController {
    private final ContactService service;

    @PostMapping("/contact")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public void contact(@Valid @RequestBody ContactRequest request) { service.contact(request); }

    @PostMapping("/newsletter/subscribe")
    @ResponseStatus(HttpStatus.CREATED)
    public void subscribe(@Valid @RequestBody NewsletterRequest request) { service.subscribe(request); }
}
