package edu.codespring.sportgh.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@Slf4j
public class FileStorageConfig {

    @Value("${file.storage.location}")
    private String storageLocation;

    @PostConstruct
    public void init() {
        try {
            Path path = Paths.get(storageLocation);
            if (!Files.exists(path)) {
                Files.createDirectories(path);
                log.info("Directory created at: " + path.toAbsolutePath());
            }
        } catch (IOException e) {
            log.error("Could not initialize storage directory", e);
            throw new RuntimeException("Could not initialize storage directory", e);
        }
    }
}
