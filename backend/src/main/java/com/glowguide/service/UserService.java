package com.glowguide.service;

import com.glowguide.dto.user.ProfileUpdateRequest;
import com.glowguide.dto.user.SkinProfileUpdateRequest;
import com.glowguide.dto.user.UserSummaryDto;
import com.glowguide.exception.BadRequestException;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.SkinProfile;
import com.glowguide.model.User;
import com.glowguide.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository users;
    private final RoutineRepository routines;
    private final QuizResultRepository quizResults;
    private final WishlistRepository wishlists;
    private final CartRepository carts;
    private final OrderRepository orders;
    private final ReviewRepository reviews;
    private final EmailVerificationTokenRepository verificationTokens;
    private final PasswordResetTokenRepository resetTokens;

    public UserSummaryDto updateProfile(String id, ProfileUpdateRequest request) {
        User user = find(id);
        user.setName(request.name().trim());
        String imageUrl = request.profileImageUrl() == null ? null : request.profileImageUrl().trim();
        if (imageUrl != null && !imageUrl.isBlank() && !imageUrl.startsWith("https://") && !imageUrl.startsWith("http://")) {
            throw new BadRequestException("Profile image must use an http or https URL");
        }
        user.setProfileImageUrl(imageUrl == null || imageUrl.isBlank() ? null : imageUrl);
        return AuthService.toSummary(users.save(user));
    }

    public UserSummaryDto updateSkinProfile(String id, SkinProfileUpdateRequest request) {
        User user = find(id);
        SkinProfile current = user.getSkinProfile();
        user.setSkinProfile(SkinProfile.builder().skinType(request.skinType())
                .concerns(request.concerns() == null ? (current == null ? List.of() : current.getConcerns()) : request.concerns())
                .sensitivity(request.sensitivity() == null ? (current == null ? null : current.getSensitivity()) : request.sensitivity()).budget(request.budget())
                .avoidedIngredients(request.avoidedIngredients() == null ? (current == null ? List.of() : current.getAvoidedIngredients()) : request.avoidedIngredients())
                .preferredRoutineSteps(request.preferredRoutineSteps() == null ? (current == null ? null : current.getPreferredRoutineSteps()) : request.preferredRoutineSteps()).build());
        return AuthService.toSummary(users.save(user));
    }

    public void deleteAccount(String id) {
        User user = find(id);
        routines.deleteByUserId(id);
        quizResults.deleteByUserId(id);
        wishlists.deleteByUserId(id);
        carts.deleteByUserId(id);
        orders.deleteByUserId(id);
        reviews.deleteByUserId(id);
        verificationTokens.deleteByUserId(id);
        resetTokens.deleteByUserId(id);
        users.delete(user);
    }

    private User find(String id) {
        return users.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
