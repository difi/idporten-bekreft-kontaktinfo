package no.digdir.krr.bekreft.kontaktinfo.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.stereotype.Component;

@Component("idporten-bekreft-kontaktinfo")
public class ContactInfoControllerHealth implements HealthIndicator {

    @Value("${featureswitch.bekreft_kontaktinfo_enabled}")
    private Boolean bekreftKontaktinfoEnabled;

    @Override
    public Health health() {

        if (!bekreftKontaktinfoEnabled) {
            return Health.down().build();
        }

        return Health.up().build();
    }
}
