package com.glowguide.service;

import com.glowguide.config.RecommendationScoringProperties;
import com.glowguide.dto.product.ProductResponse;
import com.glowguide.dto.quiz.RecommendationResponse;
import com.glowguide.dto.quiz.QuizResultResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.exception.UnauthorizedActionException;
import com.glowguide.model.*;
import com.glowguide.repository.IngredientRepository;
import com.glowguide.repository.ProductRepository;
import com.glowguide.repository.QuizResultRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class RecommendationService {
    private final QuizResultRepository results;
    private final ProductRepository products;
    private final IngredientRepository ingredients;
    private final RecommendationScoringProperties scoring;

    public RecommendationResponse forResult(String resultId, String requestingUserId) {
        QuizResult result = results.findById(resultId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz result not found"));
        if (result.getUserId() == null || !result.getUserId().equals(requestingUserId)) {
            throw new UnauthorizedActionException("You can only view recommendations for your own quiz results");
        }
        return new RecommendationResponse(QuizResultResponse.from(result), recommend(result));
    }

    public List<RecommendationResponse.Recommendation> recommend(QuizResult result) {
        List<RecommendationResponse.Recommendation> ranked = products.findByActiveTrue().stream().map(product -> score(product, result))
                .filter(Objects::nonNull).filter(item -> item.score() >= scoring.getMinimumScoreThreshold())
                .sorted(Comparator.comparingInt(RecommendationResponse.Recommendation::score).reversed())
                .toList();
        return diverseByCategory(ranked, scoring.getMaxResults());
    }

    /** Keep a high scoring cleanser, moisturizer, and sunscreen from being hidden by many similar serums. */
    private List<RecommendationResponse.Recommendation> diverseByCategory(
            List<RecommendationResponse.Recommendation> ranked, int limit) {
        List<RecommendationResponse.Recommendation> selected = new ArrayList<>();
        Map<ProductCategory, Integer> counts = new EnumMap<>(ProductCategory.class);
        // First pass gives each available category a place before any category repeats.
        for (int categoryLimit = 1; categoryLimit <= 2 && selected.size() < limit; categoryLimit++) {
            for (RecommendationResponse.Recommendation item : ranked) {
                ProductCategory category = item.product().category();
                if (counts.getOrDefault(category, 0) >= categoryLimit) continue;
                if (selected.stream().anyMatch(existing -> existing.product().id().equals(item.product().id()))) continue;
                selected.add(item);
                counts.merge(category, 1, Integer::sum);
                if (selected.size() == limit) break;
            }
        }
        return List.copyOf(selected);
    }

    private RecommendationResponse.Recommendation score(Product product, QuizResult quiz) {
        List<String> allIngredients = product.getIngredientSlugs() == null ? List.of() : product.getIngredientSlugs();
        List<String> keyIngredients = product.getKeyIngredientSlugs() == null ? List.of() : product.getKeyIngredientSlugs();
        List<String> avoided = quiz.getAvoidedIngredients() == null ? List.of() : quiz.getAvoidedIngredients();
        List<String> normalizedIngredients = new ArrayList<>(allIngredients);
        normalizedIngredients.addAll(keyIngredients);
        boolean excluded = normalizedIngredients.stream().anyMatch(ingredient -> avoided.stream()
                .anyMatch(term -> matchesIngredient(term, ingredient)));
        if (excluded) return null;
        if (quiz.getSensitivity() == SensitivityLevel.HIGH && normalizedIngredients.contains("glycolic-acid")) return null;

        int score = 0;
        List<String> reasons = new ArrayList<>();
        if (product.getSuitableSkinTypes() != null && product.getSuitableSkinTypes().contains(quiz.getSkinType())) {
            score += scoring.getSkinTypeMatch();
            reasons.add("it lists your skin type as suitable");
        }
        long concernMatches = product.getTargetedConcerns() == null || quiz.getConcerns() == null ? 0
                : quiz.getConcerns().stream().filter(product.getTargetedConcerns()::contains).count();
        if (concernMatches > 0) {
            score += (int) Math.min(concernMatches, scoring.getMaxConcernMatches()) * scoring.getConcernMatchPerItem();
            reasons.add("its documented uses overlap with your selected concerns");
        }
        List<Ingredient> productIngredients = ingredients.findBySlugIn(keyIngredients);
        long ingredientMatches = productIngredients.stream()
                .filter(ingredient -> ingredient.getTargetedConcerns() != null && quiz.getConcerns() != null
                        && quiz.getConcerns().stream().anyMatch(ingredient.getTargetedConcerns()::contains))
                .count();
        if (ingredientMatches > 0) {
            score += (int) Math.min(ingredientMatches, scoring.getMaxIngredientMatches()) * scoring.getIngredientMatchPerItem();
            reasons.add("its key ingredient profiles overlap with selected concerns");
        }
        List<String> preferences = quiz.getProductPreferences() == null ? List.of() : quiz.getProductPreferences();
        List<String> tags = product.getTags() == null ? List.of() : product.getTags();
        long preferenceMatches = preferences.stream().filter(preference -> tags.stream()
                .anyMatch(tag -> normalize(tag).contains(normalize(preference)) || normalize(preference).contains(normalize(tag))))
                .count();
        if (preferenceMatches > 0) {
            score += (int) Math.min(preferenceMatches, scoring.getMaxPreferenceMatches()) * scoring.getPreferenceMatchPerItem();
            reasons.add("it matches one or more of your product preferences");
        }
        List<String> currentRoutine = quiz.getCurrentRoutineProducts() == null ? List.of() : quiz.getCurrentRoutineProducts();
        if (currentRoutine.stream().anyMatch(step -> normalize(step).equals(normalize(product.getCategory().name())))) {
            score += scoring.getCategoryPreferenceMatch();
            reasons.add("it matches a product category you said is part of your routine");
        }
        List<String> routinePreferences = quiz.getRoutinePreferences() == null ? List.of() : quiz.getRoutinePreferences();
        if (routinePreferences.stream().anyMatch(step -> normalize(step).equals(normalize(product.getCategory().name())))) {
            score += scoring.getRoutinePreferenceMatch();
            reasons.add("it fits a routine step you chose to include");
        }
        if (quiz.getBudget() != null && quiz.getBudget().matches(product.getPrice())) {
            score += scoring.getBudgetMatch();
            reasons.add("its price falls within your selected budget range");
        }
        if (quiz.getSensitivity() == SensitivityLevel.HIGH && !allIngredients.isEmpty()) {
            Set<String> ingredientSet = new HashSet<>(allIngredients);
            long cautionPairs = ingredients.findBySlugIn(allIngredients).stream()
                    .filter(ingredient -> ingredient.getCautionIngredientSlugs() != null)
                    .flatMap(ingredient -> ingredient.getCautionIngredientSlugs().stream())
                    .filter(ingredientSet::contains).distinct().count();
            if (cautionPairs > 0) {
                score -= (int) Math.min(cautionPairs, scoring.getMaxIngredientMatches()) * scoring.getSensitivityPenaltyPerCaution();
                reasons.add("the ingredient library flags a combination caution worth reviewing for sensitive skin");
            }
        }
        if (score < 0) score = 0;
        if (reasons.isEmpty()) reasons.add("it is an active catalog item; check its full ingredient list and directions before use");
        return new RecommendationResponse.Recommendation(ProductResponse.from(product), score,
                "This is a potential match because " + String.join(" and ", reasons) + ". This is educational information, not a guarantee of results.");
    }

    private boolean matchesIngredient(String avoidedTerm, String ingredientSlug) {
        if (avoidedTerm == null || avoidedTerm.isBlank()) return false;
        String term = normalize(avoidedTerm);
        if (normalize(ingredientSlug).contains(term)) return true;
        return ingredients.findBySlug(ingredientSlug)
                .map(ingredient -> normalize(ingredient.getName()).contains(term))
                .orElse(false);
    }

    private String normalize(String text) {
        return text.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "");
    }
}
