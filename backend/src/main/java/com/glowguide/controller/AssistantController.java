package com.glowguide.controller;

import com.glowguide.dto.assistant.AssistantRequest;
import com.glowguide.dto.assistant.AssistantResponse;
import com.glowguide.service.SkincareAssistantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.glowguide.security.UserPrincipal;

@RestController
@RequestMapping("/api/assistant")
@RequiredArgsConstructor
public class AssistantController {
    private final SkincareAssistantService assistant;

    @PostMapping("/ask")
    public AssistantResponse ask(@Valid @RequestBody AssistantRequest request,
                                 @AuthenticationPrincipal UserPrincipal principal) {
        return assistant.ask(request.message(), principal == null ? null : principal.getId());
    }
}
