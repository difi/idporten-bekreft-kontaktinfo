package no.digdir.kontaktinfo.service;

import com.nimbusds.jwt.JWTClaimsSet;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.config.JwtConfigProvider;
import no.digdir.kontaktinfo.crypto.JwtSigningService;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.util.Date;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PARService {
    public static final String PAR_REQUEST_URI_PREFIX = "urn:kontaktinfo:";

    private final JwtConfigProvider jwtConfigProvider;
    private final JwtSigningService jwtSigningService;

    public boolean isValidRequestUri(String uri) {
        return uri != null && uri.matches("^" + PAR_REQUEST_URI_PREFIX + ".+$");
    }

    public String generateRequestUri() {
        return PAR_REQUEST_URI_PREFIX + IdGenerator.generateId(32);
    }

    public String makeJwt(String personIdentifikator, String email, String mobile) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .audience(jwtConfigProvider.getAud())
                .issuer(jwtConfigProvider.getIss())
                .claim("pid", personIdentifikator)
                .claim("email", email)
                .claim("mobile", mobile)
                .jwtID(UUID.randomUUID().toString())
                .issueTime(new Date(Clock.systemUTC().millis()))
                .expirationTime(new Date(Clock.systemUTC().millis() + 120000)) // Expiration time is 120 sec.
                .build();

        return jwtSigningService.signJwt(claims);
    }
}
