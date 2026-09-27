package com.glowguide.controller;

import com.glowguide.dto.media.MediaUploadResponse;
import com.glowguide.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequiredArgsConstructor
public class MediaController {
    private final MediaService media;

    @PostMapping("/api/media/profile")
    public MediaUploadResponse uploadProfile(@RequestPart("file") MultipartFile file) { return media.upload(file, "profiles"); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/media/product")
    public MediaUploadResponse uploadProduct(@RequestPart("file") MultipartFile file) { return media.upload(file, "products"); }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/api/admin/media/ingredient")
    public MediaUploadResponse uploadIngredient(@RequestPart("file") MultipartFile file) { return media.upload(file, "ingredients"); }
}
