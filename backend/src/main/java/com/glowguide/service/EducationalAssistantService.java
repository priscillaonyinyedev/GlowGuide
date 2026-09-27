package com.glowguide.service;

import com.glowguide.dto.assistant.AssistantResponse;
import com.glowguide.dto.ingredient.IngredientResponse;
import com.glowguide.dto.quiz.RecommendationResponse;
import com.glowguide.exception.BadRequestException;
import com.glowguide.model.*;
import com.glowguide.repository.IngredientRepository;
import com.glowguide.repository.QuizResultRepository;
import com.glowguide.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class EducationalAssistantService implements SkincareAssistantService {
    private static final String DISCLAIMER = "Educational information only. This assistant does not diagnose or treat skin conditions; speak with a qualified dermatologist about persistent symptoms or reactions.";
    private final IngredientRepository ingredients;
    private final RecommendationService recommendations;
    private final QuizResultRepository quizzes;
    private final UserRepository users;

    @Override
    public AssistantResponse ask(String message, String userId) {
        if (message == null || message.isBlank() || message.length() > 600) throw new BadRequestException("Write a question of up to 600 characters");
        String question = message.trim();
        String normalized = normalize(question);
        List<Ingredient> matched = ingredients.findAll().stream()
                .filter(ingredient -> normalized.contains(normalize(ingredient.getName())) || normalized.contains(normalize(ingredient.getSlug())))
                .limit(4).toList();
        List<IngredientResponse> ingredientResponses = matched.stream().map(IngredientResponse::from).toList();

        if (containsAny(normalized, "cure", "diagnose", "prescription", "rash", "infection", "medical emergency")) {
            return new AssistantResponse("I can share general ingredient education, but I can't assess symptoms or recommend treatment. Please contact a qualified healthcare professional for personal medical advice.", DISCLAIMER, ingredientResponses, List.of());
        }

        boolean asksForProducts = containsAny(normalized, "product", "recommend", "recommendation", "showme", "shopping", "suggest", "lookingfor", "whatshouldiget", "whichshouldiuse", "whatshouldiuse", "goodfor")
                || normalized.contains("withinmybudget")
                || (containsAny(normalized, "under", "below", "lessthan", "budgetof") && normalized.matches(".*\\d+.*"))
                || containsAny(normalized, "sunscreen", "suncream", "spf", "cleanser", "moisturizer", "moisturiser", "serum", "toner");
        List<RecommendationResponse.Recommendation> productMatches = List.of();
        String answer;
        if (asksForProducts) {
            QuizResult profile = profileFrom(question, normalized);
            if (userId != null) {
                QuizResult saved = quizzes.findTopByUserIdOrderByCreatedAtDesc(userId).orElseGet(() ->
                        users.findById(userId).map(User::getSkinProfile).filter(Objects::nonNull)
                                .map(this::asQuizProfile).orElse(null));
                if (saved != null) profile = mergeProfiles(profile, saved, normalized);
            }
            if (profile.getSkinType() == null && (profile.getConcerns() == null || profile.getConcerns().isEmpty()) && profile.getBudget() == null) {
                answer = "Tell me a skin type or concern and a per-product budget (for example, “oily skin under $20”), and I can use the catalogue's documented attributes to find some options. Taking the Skin Quiz gives a fuller, saved profile.";
            } else {
                Set<ProductCategory> requestedCategories = categoriesIn(normalized);
                Set<String> requestedIngredients = ingredientsIn(normalized);
                productMatches = recommendations.recommend(profile).stream()
                        .filter(item -> requestedCategories.isEmpty() || requestedCategories.contains(item.product().category()))
                        .filter(item -> requestedIngredients.isEmpty()
                                || hasRequestedIngredient(item, requestedIngredients)
                                || (item.product().category() != ProductCategory.SERUM && item.product().category() != ProductCategory.TREATMENT))
                        .filter(item -> withinExplicitLimit(item.product().price(), question)).toList();
                answer = productMatches.isEmpty()
                        ? "I couldn't find an active catalogue item matching those filters. Try widening the budget or browsing the shop."
                        : "Here are catalogue options that score against the skin details and budget in your question. Review the full ingredients and directions before deciding.";
            }
        } else if (!matched.isEmpty()) {
            answer = matched.stream().map(i -> formatIngredientAnswer(i, normalized)).reduce((a, b) -> a + "\n\n" + b).orElse("");
            if (containsAny(normalized, "together", "sametime", "combine", "combination", "sameroutine", "with", "alongside", "layer")) {
                if (matched.size() < 2) {
                    answer += " I only recognized one ingredient from the library. If you share the other active ingredient from the label, I can check whether the library has a pairing note. A full formula, strength and your skin’s tolerance also matter.";
                } else {
                    boolean caution = matched.stream().anyMatch(i -> i.getCautionIngredientSlugs() != null && matched.stream().anyMatch(other -> i.getCautionIngredientSlugs().contains(other.getSlug())))
                            || matched.stream().anyMatch(i -> matched.stream().anyMatch(other -> other.getCautionIngredientSlugs() != null && other.getCautionIngredientSlugs().contains(i.getSlug())));
                    boolean compatible = matched.stream().anyMatch(i -> i.getCompatibleIngredientSlugs() != null && matched.stream().anyMatch(other -> i.getCompatibleIngredientSlugs().contains(other.getSlug())));
                    if (caution) answer += " The ingredient library flags a pair here that may require extra care; check the ingredient pages and product directions.";
                    else if (compatible) answer += " The ingredient library lists these ingredients as commonly compatible, but formula and personal tolerance still matter.";
                    else answer += " This library has no compatibility note for this ingredient pair, so I can't confirm whether they should be layered together. Check the manufacturers' directions or ask a dermatologist.";
                    answer += " Compatibility depends on the exact formula, strength, frequency and your skin. Introduce products one at a time and consider asking a dermatologist if you have sensitive skin.";
                }
            }
        } else if (asksAboutRoutine(normalized)) {
            QuizResult profile = profileFrom(question, normalized);
            QuizResult saved = profileForUser(userId);
            if (saved != null) profile = mergeProfiles(profile, saved, normalized);
            answer = routineGuidance(profile);
            if (hasProfile(profile)) {
                productMatches = recommendations.recommend(profile).stream()
                        .filter(item -> EnumSet.of(ProductCategory.CLEANSER, ProductCategory.SERUM,
                                ProductCategory.TREATMENT, ProductCategory.MOISTURIZER, ProductCategory.SUNSCREEN)
                                .contains(item.product().category()))
                        .limit(5).toList();
                if (!productMatches.isEmpty()) answer += "\n\nI also found catalogue products that match your saved skin profile. Their match reasons are shown below.";
            }
        } else if (normalized.contains("ingredient")) {
            List<Ingredient> related = ingredientsForConcerns(concernsIn(normalized));
            ingredientResponses = related.stream().map(IngredientResponse::from).toList();
            answer = related.isEmpty()
                    ? "Tell me the ingredient or skin concern you want to learn about, and I’ll look for it in GlowGuide’s ingredient library."
                    : "The ingredient library lists these as commonly used in routines for the concern you mentioned. This is general education, not a promise of results:\n\n"
                            + related.stream().map(i -> formatIngredientAnswer(i, normalized)).reduce((a, b) -> a + "\n\n" + b).orElse("");
        } else if (!concernsIn(normalized).isEmpty()) {
            List<Ingredient> related = ingredientsForConcerns(concernsIn(normalized));
            ingredientResponses = related.stream().map(IngredientResponse::from).toList();
            answer = related.isEmpty()
                    ? "I can offer general skincare education, but the ingredient library doesn’t have a match for that concern yet. You can browse the shop or ingredient guide."
                    : "For " + concernLabel(concernsIn(normalized)) + ", the ingredient library describes these ingredients as commonly used in related routines. They do not diagnose or treat a condition; check the product directions and your own tolerance:\n\n"
                            + related.stream().map(i -> formatIngredientAnswer(i, normalized)).reduce((a, b) -> a + "\n\n" + b).orElse("");
        } else {
            answer = "I can help with ingredient basics, product order, building a simple morning or evening routine, and finding real products from the GlowGuide catalogue. For example, ask “What order should I apply my products?”, “What is niacinamide used for?”, or “Show me a moisturizer for dry skin under $25.” Taking the skin quiz helps personalize recommendations.";
        }
        return new AssistantResponse(answer, DISCLAIMER, ingredientResponses, productMatches);
    }

    /** Use the latest quiz as the default context while letting details in the current message take precedence. */
    private QuizResult mergeProfiles(QuizResult asked, QuizResult saved, String normalized) {
        List<SkinConcern> concerns = new ArrayList<>(saved.getConcerns() == null ? List.of() : saved.getConcerns());
        if (asked.getConcerns() != null) asked.getConcerns().forEach(concern -> add(concerns, concern));
        return QuizResult.builder()
                .skinType(asked.getSkinType() == null ? saved.getSkinType() : asked.getSkinType())
                .concerns(concerns)
                .sensitivity(normalized.contains("sensitive") ? asked.getSensitivity() : saved.getSensitivity())
                .budget(asked.getBudget() == null ? saved.getBudget() : asked.getBudget())
                .avoidedIngredients(saved.getAvoidedIngredients() == null ? List.of() : saved.getAvoidedIngredients())
                .productPreferences(saved.getProductPreferences() == null ? List.of() : saved.getProductPreferences())
                .currentRoutineProducts(saved.getCurrentRoutineProducts() == null ? List.of() : saved.getCurrentRoutineProducts())
                .routinePreferences(saved.getRoutinePreferences() == null ? List.of() : saved.getRoutinePreferences())
                .build();
    }

    private QuizResult asQuizProfile(SkinProfile profile) {
        return QuizResult.builder().skinType(profile.getSkinType()).concerns(profile.getConcerns())
                .sensitivity(profile.getSensitivity()).budget(profile.getBudget())
                .avoidedIngredients(profile.getAvoidedIngredients()).routinePreferences(profile.getRoutinePreferences()).build();
    }

    private QuizResult profileForUser(String userId) {
        if (userId == null) return null;
        return quizzes.findTopByUserIdOrderByCreatedAtDesc(userId)
                .orElseGet(() -> users.findById(userId).map(User::getSkinProfile).filter(Objects::nonNull)
                        .map(this::asQuizProfile).orElse(null));
    }

    private boolean hasProfile(QuizResult profile) {
        return profile != null && (profile.getSkinType() != null
                || (profile.getConcerns() != null && !profile.getConcerns().isEmpty()));
    }

    private boolean asksAboutRoutine(String normalized) {
        return containsAny(normalized, "routine", "skincareorder", "orderofskincare", "layeringorder",
                "whatorder", "orderdo", "applyfirst", "applynext", "morningroutine", "eveningroutine", "nightroutine",
                "amroutine", "pmroutine", "startskincare", "newtoskincare", "stepsfor", "stepsshouldi",
                "morning", "evening", "atnight");
    }

    private String routineGuidance(QuizResult profile) {
        if (!hasProfile(profile)) {
            return "A simple place to start is:\nMorning: gentle cleanser → optional toner → one serum if it suits your needs → moisturizer if your skin needs it → broad-spectrum sunscreen.\nEvening: cleanser → optional toner → one treatment or serum → moisturizer.\n\nKeep the routine comfortable and introduce one new product at a time. Toner is optional. Take the skin quiz and save your profile for recommendations based on your skin type, concerns, sensitivity, and preferences.";
        }
        String skin = profile.getSkinType() == null ? "your saved skin profile" : profile.getSkinType().name().toLowerCase(Locale.ROOT) + " skin";
        String concern = profile.getConcerns() == null || profile.getConcerns().isEmpty() ? "your selected preferences" : concernLabel(profile.getConcerns());
        return "Based on your saved profile (" + skin + " and " + concern + "), here’s a gentle framework to consider:\nMorning: cleanser → optional toner if you use one → a serum that fits your selected concerns → moisturizer if needed → sunscreen.\nEvening: cleanser → optional toner → one treatment or serum suited to your profile → moisturizer.\n\nYour answers help rank the matching catalogue options below. Follow each product’s directions, introduce one new product at a time, and skip any step that irritates your skin. Toner is optional, and this routine is educational rather than medical advice.";
    }

    private String formatIngredientAnswer(Ingredient ingredient, String normalizedQuestion) {
        StringBuilder answer = new StringBuilder(ingredient.getName()).append(": ").append(ingredient.getWhatItDoes());
        boolean asksUsage = containsAny(normalizedQuestion, "howdoiuse", "howtouse", "howoften", "whencan i use", "caniuse", "shouldiuse", "morning", "evening", "night", "routine", "layer", "together", "sametime", "apply");
        if (asksUsage && ingredient.getUsageInfo() != null && !ingredient.getUsageInfo().isBlank()) {
            answer.append("\nHow to approach it: ").append(ingredient.getUsageInfo());
        }
        if (asksUsage && ingredient.getIrritationConsiderations() != null && !ingredient.getIrritationConsiderations().isBlank()) {
            answer.append("\nKeep in mind: ").append(ingredient.getIrritationConsiderations());
        }
        return answer.toString();
    }

    private List<Ingredient> ingredientsForConcerns(List<SkinConcern> concerns) {
        if (concerns.isEmpty()) return List.of();
        return ingredients.findAll().stream()
                .filter(i -> i.getTargetedConcerns() != null && i.getTargetedConcerns().stream().anyMatch(concerns::contains))
                .limit(5).toList();
    }

    private String concernLabel(List<SkinConcern> concerns) {
        return concerns.stream().map(c -> c.name().toLowerCase(Locale.ROOT).replace('_', ' '))
                .reduce((a, b) -> a + " and " + b).orElse("your selected concerns");
    }

    private QuizResult profileFrom(String question, String normalized) {
        SkinType skinType = Arrays.stream(SkinType.values()).filter(type -> normalized.contains(normalize(type.name()))).findFirst().orElse(null);
        List<SkinConcern> concerns = concernsIn(normalized);
        Matcher matcher = Pattern.compile("(?:under|below|less than|budget of)\\s*\\$?([0-9]{1,3})", Pattern.CASE_INSENSITIVE).matcher(question);
        BudgetRange budget = null;
        if (matcher.find()) {
            double cap = Double.parseDouble(matcher.group(1));
            budget = cap <= 15 ? BudgetRange.BUDGET : cap <= 35 ? BudgetRange.MID_RANGE : cap <= 70 ? BudgetRange.PREMIUM : BudgetRange.LUXURY;
        }
        return QuizResult.builder().skinType(skinType).concerns(concerns).budget(budget)
                .sensitivity(normalized.contains("sensitive") ? SensitivityLevel.HIGH : SensitivityLevel.MEDIUM)
                .avoidedIngredients(List.of()).productPreferences(List.of()).build();
    }

    private void add(List<SkinConcern> concerns, SkinConcern value) {
        if (!concerns.contains(value)) concerns.add(value);
    }
    private List<SkinConcern> concernsIn(String normalized) {
        List<SkinConcern> concerns = new ArrayList<>(Arrays.stream(SkinConcern.values()).filter(c -> normalized.contains(normalize(c.name()))).toList());
        if (containsAny(normalized, "acne", "breakout", "blemish", "pimple")) add(concerns, SkinConcern.ACNE_PRONE);
        if (containsAny(normalized, "darkspot", "hyperpigmentation", "postacnemark", "acnemark")) add(concerns, SkinConcern.DARK_SPOTS);
        if (containsAny(normalized, "uneventone", "pigmentation", "discoloration", "discolouration")) add(concerns, SkinConcern.UNEVEN_TONE);
        if (containsAny(normalized, "dryskin", "flaky", "tightskin")) add(concerns, SkinConcern.DRYNESS);
        if (containsAny(normalized, "dehydrated", "dehydration")) add(concerns, SkinConcern.DEHYDRATION);
        if (containsAny(normalized, "redness", "rednessprone")) add(concerns, SkinConcern.REDNESS);
        if (containsAny(normalized, "dullskin", "dullness")) add(concerns, SkinConcern.DULLNESS);
        if (containsAny(normalized, "roughtexture", "skintexture")) add(concerns, SkinConcern.TEXTURE);
        return concerns;
    }
    private Set<ProductCategory> categoriesIn(String normalized) {
        Set<ProductCategory> categories = new LinkedHashSet<>();
        if (containsAny(normalized, "sunscreen", "suncream", "spf", "sunblock", "sunprotection")) categories.add(ProductCategory.SUNSCREEN);
        if (containsAny(normalized, "cleanser", "cleansing", "facewash", "facecleanser")) categories.add(ProductCategory.CLEANSER);
        if (containsAny(normalized, "moisturizer", "moisturiser", "moisturizingcream", "moisturisingcream")) categories.add(ProductCategory.MOISTURIZER);
        if (containsAny(normalized, "serum", "vitaminc", "niacinamide", "retinol", "hyaluronicacid")) categories.add(ProductCategory.SERUM);
        if (containsAny(normalized, "toner", "toning", "essence")) categories.add(ProductCategory.TONER);
        if (containsAny(normalized, "treatment", "exfoliant", "salicylicacid", "glycolicacid", "azelaicacid")) categories.add(ProductCategory.TREATMENT);
        return categories;
    }
    private Set<String> ingredientsIn(String normalized) {
        Set<String> requested = new LinkedHashSet<>();
        for (Ingredient ingredient : ingredients.findAll()) {
            String name = normalize(ingredient.getName());
            String slug = normalize(ingredient.getSlug());
            if (normalized.contains(name) || normalized.contains(slug)) requested.add(ingredient.getSlug());
        }
        if (normalized.contains("vitaminc")) requested.add("vitamin-c");
        if (normalized.contains("bha")) requested.add("salicylic-acid");
        if (normalized.contains("aha")) requested.add("glycolic-acid");
        return requested;
    }
    private boolean hasRequestedIngredient(RecommendationResponse.Recommendation item, Set<String> requested) {
        List<String> keys = item.product().keyIngredientSlugs() == null ? List.of() : item.product().keyIngredientSlugs();
        List<String> all = item.product().ingredientSlugs() == null ? List.of() : item.product().ingredientSlugs();
        return java.util.stream.Stream.concat(keys.stream(), all.stream()).anyMatch(requested::contains);
    }
    private boolean withinExplicitLimit(double price, String question) {
        Matcher matcher = Pattern.compile("(?:under|below|less than|budget of)\\s*\\$?([0-9]{1,3})", Pattern.CASE_INSENSITIVE).matcher(question);
        return !matcher.find() || price <= Double.parseDouble(matcher.group(1));
    }
    private boolean containsAny(String value, String... terms) { return Arrays.stream(terms).anyMatch(value::contains); }
    private String normalize(String value) { return value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", ""); }
}

