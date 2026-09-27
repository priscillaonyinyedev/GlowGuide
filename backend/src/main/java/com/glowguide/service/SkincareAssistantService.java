package com.glowguide.service;

import com.glowguide.dto.assistant.AssistantResponse;

public interface SkincareAssistantService {
    AssistantResponse ask(String message, String userId);
    default AssistantResponse ask(String message) { return ask(message, null); }
}
