package no.digdir.kontaktinfo;

import no.digdir.kontaktinfo.config.KrrConfigProvider;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties({KrrConfigProvider.class})

public class Application {
    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }
}
