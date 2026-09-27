package com.glowguide.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Thin wrapper around JavaMailSender for the three transactional emails the
 * platform sends: email verification, password reset, and contact-form
 * acknowledgements. Kept separate so the mail provider can change without
 * touching AuthService/ContactService.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String fromAddress;

    @Value("${app.frontend.base-url}")
    private String frontendBaseUrl;

    @Value("${app.mail.contact-to:}")
    private String contactToAddress;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${spring.mail.password:}")
    private String mailPassword;

    public boolean isResetEmailConfigured() {
        return hasMailCredentials();
    }

    public boolean isContactEmailConfigured() {
        return hasMailCredentials() && contactToAddress != null && !contactToAddress.isBlank();
    }

    public void sendVerificationEmail(String toEmail, String name, String token) {
        String link = frontendBaseUrl + "/verify-email?token=" + token;
        String body = """
                Hi %s,

                Welcome to GlowGuide! Please verify your email address to activate your account:

                %s

                This link expires in 24 hours. If you didn't create a GlowGuide account, you can ignore this email.

                - The GlowGuide Team
                """.formatted(name, link);

        send(toEmail, "Verify your GlowGuide account", body);
    }

    public void sendPasswordResetEmail(String toEmail, String name, String token) {
        String link = frontendBaseUrl + "/reset-password?token=" + token;
        String body = """
                Hi %s,

                We received a request to reset your GlowGuide password. Click the link below to choose a new one:

                %s

                This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.

                - The GlowGuide Team
                """.formatted(name, link);

        send(toEmail, "Reset your GlowGuide password", body);
    }

    public void sendContactAcknowledgement(String toEmail, String name) {
        String body = """
                Hi %s,

                Thanks for reaching out to GlowGuide. Our team has received your message and will get back to you shortly.

                - The GlowGuide Team
                """.formatted(name);

        send(toEmail, "We received your message", body);
    }

    public boolean sendContactNotification(String name, String fromEmail, String subject, String body) {
        if (!isContactEmailConfigured()) {
            log.warn("Contact notification email is not configured");
            return false;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(contactToAddress);
        message.setReplyTo(fromEmail);
        message.setSubject("GlowGuide contact: " + subject);
        message.setText("From: %s <%s>\nSubject: %s\n\n%s".formatted(name, fromEmail, subject, body));
        return send(message);
    }

    private boolean hasMailCredentials() {
        return mailUsername != null && !mailUsername.isBlank()
                && mailPassword != null && !mailPassword.isBlank()
                && fromAddress != null && !fromAddress.isBlank();
    }

    private boolean send(String to, String subject, String body) {
        if (!hasMailCredentials()) {
            log.warn("Email delivery is not configured; message was not sent");
            return false;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        return send(message);
    }

    private boolean send(SimpleMailMessage message) {
        try {
            mailSender.send(message);
            return true;
        } catch (Exception ex) {
            // Do not log the recipient address or message body; provider errors can contain sensitive details.
            log.error("Email delivery failed ({})", ex.getClass().getSimpleName());
            return false;
        }
    }
}
