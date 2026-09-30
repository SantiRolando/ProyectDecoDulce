package com.example.DecoDulce_Api.configuration;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class UploadedImagesConfiguration implements WebMvcConfigurer {
    private final String resourceLocation;

    public UploadedImagesConfiguration(@Value("${app.uploads.directory:uploads/cakes}") String directory) {
        Path path = Paths.get(directory).toAbsolutePath().normalize();
        String location = path.toUri().toString();
        this.resourceLocation = location.endsWith("/") ? location : location + "/";
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/cakes/**")
                .addResourceLocations(resourceLocation);
    }
}