package com.glowguide.controller;

import com.glowguide.dto.routine.RoutineRequest;
import com.glowguide.dto.routine.RoutineResponse;
import com.glowguide.security.UserPrincipal;
import com.glowguide.service.RoutineService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/routines")
@RequiredArgsConstructor
public class RoutineController {
    private final RoutineService service;

    @GetMapping
    public List<RoutineResponse> list(@AuthenticationPrincipal UserPrincipal principal) {
        return service.list(principal.getId());
    }

    @GetMapping("/{id}")
    public RoutineResponse get(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal) {
        return service.get(id, principal.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoutineResponse create(@Valid @RequestBody RoutineRequest request, @AuthenticationPrincipal UserPrincipal principal) {
        return service.create(request, principal.getId());
    }

    @PutMapping("/{id}")
    public RoutineResponse update(@PathVariable String id, @Valid @RequestBody RoutineRequest request,
                                  @AuthenticationPrincipal UserPrincipal principal) {
        return service.update(id, request, principal.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id, @AuthenticationPrincipal UserPrincipal principal) {
        service.delete(id, principal.getId());
    }
}
