package com.glowguide.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.glowguide.config.CloudinaryProperties;
import com.glowguide.dto.media.MediaUploadResponse;
import com.glowguide.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MediaService {
    private static final long MAX_IMAGE_BYTES = 5L * 1024 * 1024;
    private static final Set<String> IMAGE_TYPES = Set.of("image/jpeg", "image/png", "image/webp");
    private final Cloudinary cloudinary;
    private final CloudinaryProperties properties;

    public MediaUploadResponse upload(MultipartFile file, String purpose) {
        if (file == null || file.isEmpty()) throw new BadRequestException("Choose an image to upload");
        if (file.getSize() > MAX_IMAGE_BYTES) throw new BadRequestException("Images must be 5 MB or smaller");
        if (file.getContentType() == null || !IMAGE_TYPES.contains(file.getContentType().toLowerCase()))
            throw new BadRequestException("Upload a JPG, PNG, or WebP image");
        if (properties.getCloudName() == null || properties.getCloudName().isBlank()
                || properties.getApiKey() == null || properties.getApiKey().isBlank()
                || properties.getApiSecret() == null || properties.getApiSecret().isBlank())
            throw new BadRequestException("Image uploads are not configured yet");
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "glowguide/" + purpose, "resource_type", "image", "overwrite", false,
                    "allowed_formats", new String[]{"jpg", "jpeg", "png", "webp"}));
            return new MediaUploadResponse(String.valueOf(result.get("secure_url")), String.valueOf(result.get("public_id")),
                    number(result.get("width")), number(result.get("height")));
        } catch (IOException e) {
            throw new BadRequestException("Image upload failed. Please try another image.");
        }
    }

    private int number(Object value) { return value instanceof Number n ? n.intValue() : 0; }
}
