package com.glowguide.controller;

import com.glowguide.dto.quiz.QuizResultResponse;
import com.glowguide.dto.quiz.QuizSubmitRequest;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quiz")
@RequiredArgsConstructor
public class QuizController {
    private final QuizService service;

    @PostMapping("/submit")
    public QuizResultResponse submit(@Valid @RequestBody QuizSubmitRequest request,
                                     @AuthenticationPrincipal UserPrincipal principal) {
        return service.submit(request, principal.getId());
    }

    @GetMapping("/results")
    public List<QuizResultResponse> mine(@AuthenticationPrincipal UserPrincipal principal) {
        return service.mine(principal.getId());
    }

    @GetMapping("/results/latest")
    public QuizResultResponse latest(@AuthenticationPrincipal UserPrincipal principal) {
        return service.latest(principal.getId());
    }
}
