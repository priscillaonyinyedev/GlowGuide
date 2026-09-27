package com.glowguide.controller;

import com.glowguide.dto.quiz.RecommendationResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.repository.QuizResultRepository;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recommendations")
@RequiredArgsConstructor
public class RecommendationController {
    private final RecommendationService recommendations;
    private final QuizResultRepository results;

    @GetMapping("/{quizResultId}")
    public RecommendationResponse forResult(@PathVariable String quizResultId,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        return recommendations.forResult(quizResultId, principal.getId());
    }

    @GetMapping
    public RecommendationResponse forLatest(@AuthenticationPrincipal UserPrincipal principal) {
        String resultId = results.findTopByUserIdOrderByCreatedAtDesc(principal.getId())
                .map(result -> result.getId()).orElseThrow(() -> new ResourceNotFoundException("No quiz results found"));
        return recommendations.forResult(resultId, principal.getId());
    }
}
