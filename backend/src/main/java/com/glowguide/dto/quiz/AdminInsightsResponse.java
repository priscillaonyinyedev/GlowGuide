package com.glowguide.dto.quiz;

import java.util.Map;

public record AdminInsightsResponse(long total, Map<String, Long> skinTypes, Map<String, Long> concerns,
                                    Map<String, Long> sensitivities, Map<String, Long> budgets) {}
