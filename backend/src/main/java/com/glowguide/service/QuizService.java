package com.glowguide.service;

import com.glowguide.dto.quiz.QuizResultResponse;
import com.glowguide.dto.quiz.QuizSubmitRequest;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.QuizResult;
import com.glowguide.model.SkinProfile;
import com.glowguide.model.User;
import com.glowguide.repository.QuizResultRepository;
import com.glowguide.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuizService {
    private final QuizResultRepository results;
    private final UserRepository users;

    public QuizResultResponse submit(QuizSubmitRequest request, String userId) {
        QuizResult result = QuizResult.builder()
                .userId(userId)
                .skinType(request.skinType())
                .concerns(request.concerns() == null ? List.of() : request.concerns())
                .sensitivity(request.sensitivity())
                .currentRoutineProducts(request.currentRoutineProducts() == null ? List.of() : request.currentRoutineProducts())
                .productPreferences(request.productPreferences() == null ? List.of() : request.productPreferences())
                .routinePreferences(request.routinePreferences() == null ? List.of() : request.routinePreferences())
                .budget(request.budget())
                .avoidedIngredients(request.avoidedIngredients() == null ? List.of() : request.avoidedIngredients())
                .preferredRoutineSteps(request.preferredRoutineSteps())
                .build();
        QuizResult saved = results.save(result);
        if (userId != null) {
            users.findById(userId).ifPresent(user -> {
                user.setSkinProfile(SkinProfile.builder()
                        .skinType(saved.getSkinType()).concerns(saved.getConcerns()).sensitivity(saved.getSensitivity())
                        .budget(saved.getBudget()).avoidedIngredients(saved.getAvoidedIngredients())
                        .routinePreferences(saved.getRoutinePreferences())
                        .preferredRoutineSteps(saved.getPreferredRoutineSteps()).build());
                users.save(user);
            });
        }
        return QuizResultResponse.from(saved);
    }

    public List<QuizResultResponse> mine(String userId) {
        return results.findByUserIdOrderByCreatedAtDesc(userId).stream().map(QuizResultResponse::from).toList();
    }

    public QuizResultResponse latest(String userId) {
        return results.findTopByUserIdOrderByCreatedAtDesc(userId).map(QuizResultResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("No quiz results found"));
    }
}
