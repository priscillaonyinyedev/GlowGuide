package com.glowguide.service;

import com.glowguide.dto.routine.RoutineRequest;
import com.glowguide.dto.routine.RoutineResponse;
import com.glowguide.exception.ResourceNotFoundException;
import com.glowguide.model.Product;
import com.glowguide.model.Routine;
import com.glowguide.model.RoutineStep;
import com.glowguide.repository.ProductRepository;
import com.glowguide.repository.RoutineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RoutineService {
    private final RoutineRepository routines;
    private final ProductRepository products;

    public List<RoutineResponse> list(String userId) {
        return routines.findByUserId(userId).stream().map(RoutineResponse::from).toList();
    }

    public RoutineResponse get(String id, String userId) {
        return routines.findByIdAndUserId(id, userId).map(RoutineResponse::from)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
    }

    public RoutineResponse create(RoutineRequest request, String userId) {
        Routine routine = Routine.builder().userId(userId).name(request.name().trim()).type(request.type())
                .steps(resolveSteps(request)).build();
        return RoutineResponse.from(routines.save(routine));
    }

    public RoutineResponse update(String id, RoutineRequest request, String userId) {
        Routine routine = routines.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
        routine.setName(request.name().trim());
        routine.setType(request.type());
        routine.setSteps(resolveSteps(request));
        return RoutineResponse.from(routines.save(routine));
    }

    public void delete(String id, String userId) {
        Routine routine = routines.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Routine not found"));
        routines.delete(routine);
    }

    private List<RoutineStep> resolveSteps(RoutineRequest request) {
        return request.steps().stream().sorted(Comparator.comparingInt(step -> step.order())).map(step -> {
            Product product = products.findById(step.productId()).filter(Product::isActive)
                    .orElseThrow(() -> new ResourceNotFoundException("A routine product is not available"));
            return RoutineStep.builder().order(step.order()).productId(product.getId()).productName(product.getName())
                    .productImageUrl(product.getImages() == null || product.getImages().isEmpty() ? null : product.getImages().get(0))
                    .category(product.getCategory()).build();
        }).toList();
    }
}
