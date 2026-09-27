package com.glowguide.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Non-sensitive payment metadata only. Raw card numbers/CVVs must never reach
 * this backend or MongoDB - a real integration (e.g. Stripe) would hand back
 * a provider-side token/paymentIntentId, which is all that is stored here.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentInfo {
    private String provider;
    private String providerPaymentId;
    private String cardBrand;
    private String last4;
    private PaymentStatus status;
}
