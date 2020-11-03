package no.digdir.kontaktinfo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "krr", ignoreUnknownFields = false)
public class KrrConfigProvider {
    private String url;
    private Integer tipDaysUser;
    private Timeout timeout;

    @Data
    public static class Timeout {
        private Integer read;
        private Integer connect;
    }


}