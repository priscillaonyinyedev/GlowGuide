package com.glowguide.repository;

import com.glowguide.model.Product;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Repository
@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {

    private final MongoTemplate mongoTemplate;

    @Override
    public Page<Product> search(ProductFilter filter, Pageable pageable) {
        Query query = new Query().with(pageable);
        List<Criteria> criteriaList = new ArrayList<>();

        criteriaList.add(Criteria.where("active").is(true));

        if (filter != null) {
            if (filter.getKeyword() != null && !filter.getKeyword().isBlank()) {
                Pattern pattern = Pattern.compile(Pattern.quote(filter.getKeyword().trim()), Pattern.CASE_INSENSITIVE);
                List<Criteria> keywordCriteria = new ArrayList<>(List.of(
                        Criteria.where("name").regex(pattern),
                        Criteria.where("brandName").regex(pattern),
                        Criteria.where("description").regex(pattern)));
                if (notEmpty(filter.getKeywordIngredientSlugs())) {
                    keywordCriteria.add(Criteria.where("ingredientSlugs").in(filter.getKeywordIngredientSlugs()));
                }
                criteriaList.add(new Criteria().orOperator(keywordCriteria.toArray(new Criteria[0])));
            }
            if (notEmpty(filter.getBrandSlugs())) {
                criteriaList.add(Criteria.where("brandSlug").in(filter.getBrandSlugs()));
            }
            if (notEmpty(filter.getCategories())) {
                criteriaList.add(Criteria.where("category").in(filter.getCategories()));
            }
            if (notEmpty(filter.getSkinTypes())) {
                criteriaList.add(Criteria.where("suitableSkinTypes").in(filter.getSkinTypes()));
            }
            if (notEmpty(filter.getConcerns())) {
                criteriaList.add(Criteria.where("targetedConcerns").in(filter.getConcerns()));
            }
            if (notEmpty(filter.getIngredientSlugs())) {
                criteriaList.add(Criteria.where("ingredientSlugs").in(filter.getIngredientSlugs()));
            }
            if (filter.getMinPrice() != null || filter.getMaxPrice() != null) {
                Criteria priceCriteria = Criteria.where("price");
                if (filter.getMinPrice() != null) priceCriteria = priceCriteria.gte(filter.getMinPrice());
                if (filter.getMaxPrice() != null) priceCriteria = priceCriteria.lte(filter.getMaxPrice());
                criteriaList.add(priceCriteria);
            }
            if (filter.getMinRating() != null) {
                criteriaList.add(Criteria.where("averageRating").gte(filter.getMinRating()));
            }
            if (Boolean.TRUE.equals(filter.getFeaturedOnly())) {
                criteriaList.add(Criteria.where("featured").is(true));
            }
        }

        Criteria finalCriteria = new Criteria().andOperator(criteriaList.toArray(new Criteria[0]));
        query.addCriteria(finalCriteria);

        long total = mongoTemplate.count(Query.of(query).limit(-1).skip(-1), Product.class);
        List<Product> results = mongoTemplate.find(query, Product.class);

        return new PageImpl<>(results, pageable, total);
    }

    private boolean notEmpty(List<?> list) {
        return list != null && !list.isEmpty();
    }
}
