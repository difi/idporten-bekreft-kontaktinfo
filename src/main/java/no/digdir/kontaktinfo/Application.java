package no.digdir.kontaktinfo;

import no.digdir.kontaktinfo.config.ConfigProvider;
import no.digdir.kontaktinfo.config.OAuth2AuthorizationClientProviderConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.web.servlet.error.ErrorMvcAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication (exclude = {ErrorMvcAutoConfiguration.class})
@EnableConfigurationProperties({ConfigProvider.class})

public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
