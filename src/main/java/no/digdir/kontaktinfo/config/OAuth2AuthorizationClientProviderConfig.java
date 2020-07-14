package no.digdir.kontaktinfo.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "spring.security.oauth2.client")
public class OAuth2AuthorizationClientProviderConfig {

    private Provider idportenProvider;
    private Registration idportenRegistration;

    @Data
    public static class Provider {
        private String issuerUri;
        private String userNameAttribute;
    }

    @Data
    public static class Registration {
        private String clientId;
        private String clientSecret;
        private String authorizationGrantType;
        private String redirectUri;
        private String scope;
    }
}
