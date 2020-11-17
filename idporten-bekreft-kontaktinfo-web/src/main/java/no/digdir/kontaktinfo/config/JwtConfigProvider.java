package no.digdir.kontaktinfo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "jwt", ignoreUnknownFields = false)
public class JwtConfigProvider {
    private Keystore keystore;
    private String iss;
    private String aud;

    @Data
    @ConfigurationProperties(prefix="jwt.keystore")
    public static class Keystore {
        private String type;
        private String location;
        private String password;
        private String keyAlias;
        private String keyPassword;

    }



}
