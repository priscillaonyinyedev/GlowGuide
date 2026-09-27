package com.glowguide.model;

/** Approximate per-product price bands used to match the quiz budget answer against product prices. */
public enum BudgetRange {
    BUDGET(0, 15),
    MID_RANGE(15, 35),
    PREMIUM(35, 70),
    LUXURY(70, Integer.MAX_VALUE);

    private final int minPrice;
    private final int maxPrice;

    BudgetRange(int minPrice, int maxPrice) {
        this.minPrice = minPrice;
        this.maxPrice = maxPrice;
    }

    public boolean matches(double price) {
        return price >= minPrice && price <= maxPrice;
    }
}
