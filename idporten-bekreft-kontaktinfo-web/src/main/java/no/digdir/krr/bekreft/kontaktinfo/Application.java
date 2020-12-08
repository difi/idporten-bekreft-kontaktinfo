package no.digdir.krr.bekreft.kontaktinfo;

import no.digdir.krr.bekreft.kontaktinfo.config.JwtConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.config.KrrConfigProvider;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyProvider;
import no.digdir.krr.bekreft.kontaktinfo.crypto.KeyStoreProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ResourceLoader;

@SpringBootApplication
@EnableConfigurationProperties({KrrConfigProvider.class})
public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public KeyStoreProvider keyStoreProvider(JwtConfigProvider configProvider, ResourceLoader resourceLoader) {
        return new KeyStoreProvider(configProvider.getKeystore().getType(), configProvider.getKeystore().getLocation(), configProvider.getKeystore().getPassword()
                , resourceLoader);
    }

    @Bean
    public KeyProvider keyProvider(JwtConfigProvider configProvider, KeyStoreProvider keyStoreProvider) {
        return new KeyProvider(keyStoreProvider.keyStore(), configProvider.getKeystore().getKeyAlias(), configProvider.getKeystore().getKeyPassword());
    }

}
