package no.digdir.krr.bekreft.kontaktinfo.integration;

import no.digdir.krr.bekreft.kontaktinfo.config.KrrConfigProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component("kontaktregister-client")
public class KontaktregisterHealth implements HealthIndicator {

    private final RestTemplate restTemplate;
    private final KrrConfigProvider krrConfigProvider;

    @Autowired
    public KontaktregisterHealth(RestTemplate restTemplate, KrrConfigProvider krrConfigProvider) {
        this.krrConfigProvider = krrConfigProvider;
        this.restTemplate = restTemplate;

        restTemplate.getMessageConverters().add(new StringHttpMessageConverter());
    }

    @Override
    public Health health() {

        String url = krrConfigProvider.getUrl() + "/smoketest";

        try {
            ResponseEntity<String> responseEntity = restTemplate.getForEntity(url, String.class);
            if (responseEntity.getBody().contains("FAILED") || responseEntity.getBody().contains("\"status\": \"DOWN\"")) {
                return Health.down()
                        .withDetail("message", "Smoketest reports service failure")
                        .withDetail("url", url)
                        .build();
            }
            return Health.up().build();
        } catch (Exception e) {
            return Health.down(e).withDetail("url", url).build();
        }
    }
}
