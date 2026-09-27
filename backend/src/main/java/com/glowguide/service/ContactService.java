package com.glowguide.service;

import com.glowguide.dto.contact.ContactRequest;
import com.glowguide.dto.contact.NewsletterRequest;
import com.glowguide.exception.DuplicateResourceException;
import com.glowguide.model.ContactMessage;
import com.glowguide.model.NewsletterSubscriber;
import com.glowguide.repository.ContactMessageRepository;
import com.glowguide.repository.NewsletterSubscriberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactMessageRepository messages;
    private final NewsletterSubscriberRepository subscribers;
    private final EmailService emailService;

    public void contact(ContactRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        messages.save(ContactMessage.builder().name(request.name().trim()).email(email)
                .subject(request.subject().trim()).message(request.message().trim()).build());
        if (!emailService.sendContactNotification(request.name().trim(), email,
                request.subject().trim(), request.message().trim())) {
            throw new EmailDeliveryUnavailableException();
        }
        emailService.sendContactAcknowledgement(email, request.name().trim());
    }

    public void subscribe(NewsletterRequest request) {
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        if (subscribers.existsByEmail(email)) throw new DuplicateResourceException("This email is already subscribed");
        subscribers.save(NewsletterSubscriber.builder().email(email).build());
    }
}
