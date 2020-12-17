package no.digdir.krr.bekreft.kontaktinfo;

import no.digdir.krr.bekreft.kontaktinfo.config.OpenIDConnectConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.integration.OpenIDConnectKontaktInfo;
import no.digdir.krr.bekreft.kontaktinfo.config.JwtConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.config.KrrConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyProvider;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyStoreProvider;
import no.digdir.krr.bekreft.kontaktinfo.service.KontaktinfoCache;
import no.idporten.sdk.oidcserver.OpenIDConnectIntegration;
import no.idporten.sdk.oidcserver.config.OpenIDConnectSdkConfiguration;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@SpringBootApplication
@EnableConfigurationProperties({KrrConfigProvider.class})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public KeyStoreProvider keyStoreProvider(JwtConfigProvider configProvider, ResourceLoader resourceLoader) {
        return new KeyStoreProvider(
                configProvider.getKeystore().getType(),
                configProvider.getKeystore().getLocation(),
                configProvider.getKeystore().getPassword(),
                resourceLoader);
    }

    @Bean
    public KeyProvider keyProvider(JwtConfigProvider configProvider, KeyStoreProvider keyStoreProvider) {
        return new KeyProvider(
                keyStoreProvider.keyStore(),
                configProvider.getKeystore().getKeyAlias(),
                configProvider.getKeystore().getKeyPassword());
    }

    @Bean
    public OpenIDConnectIntegration openIDConnectSdk(
            KontaktinfoCache kontaktinfoCache,
            KeyStoreProvider keyStoreProvider,
            JwtConfigProvider configProvider,
            OpenIDConnectConfigProvider oidcConfigProvider
    ) throws Exception {
        URI issuer = new URI(oidcConfigProvider.getIssuer());
        int parLifetimeSeconds = oidcConfigProvider.getParLifetimeSeconds();
        int authorizationLifetimeSeconds = oidcConfigProvider.getAuthorizationLifetimeSeconds();

        OpenIDConnectSdkConfiguration sdkConfiguration = OpenIDConnectSdkConfiguration.builder()
                .internalId(oidcConfigProvider.getInternalId())
                .issuer(issuer)
                .pushedAuthorizationRequestEndpoint(UriComponentsBuilder.fromUri(issuer).path("/par").build().toUri())
                .authorizationEndpoint(UriComponentsBuilder.fromUri(issuer).path("/authorize").build().toUri())
                .tokenEndpoint(UriComponentsBuilder.fromUri(issuer).path("/token").build().toUri())
                .jwksUri(UriComponentsBuilder.fromUri(issuer).path("/jwks").build().toUri())
                .authorizationRequestLifetimeSeconds(parLifetimeSeconds)
                .authorizationLifetimeSeconds(authorizationLifetimeSeconds)
                .acrValue(oidcConfigProvider.getAcr())
                .clients(oidcConfigProvider.getClients())
                .cache(kontaktinfoCache)
                .keystore(keyStoreProvider.keyStore(), configProvider.getKeystore().getKeyAlias(), configProvider.getKeystore().getKeyPassword())
                .uiLocale(oidcConfigProvider.getLocale())
                .build();
        return new OpenIDConnectKontaktInfo(sdkConfiguration);
    }
}
