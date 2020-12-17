package no.digdir.krr.bekreft.kontaktinfo.config;

import lombok.Data;
import no.idporten.sdk.oidcserver.client.ClientMetadata;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import java.util.List;

@Data
@Validated
@Configuration
@ConfigurationProperties(prefix = "oidc-sdk", ignoreUnknownFields = false)
public class OpenIDConnectConfigProvider {
    private int parLifetimeSeconds;
    private int authorizationLifetimeSeconds;
    private String internalId;
    private String issuer;
    private String acr;
    private String locale;
    private List<ClientMetadata> clients;

}
