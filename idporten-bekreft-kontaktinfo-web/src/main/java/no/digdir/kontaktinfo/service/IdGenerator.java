package no.digdir.kontaktinfo.service;

import java.security.SecureRandom;
import java.util.Base64;

public final class IdGenerator {

    public static String generateId(int length) {
        byte[] bytes = new byte[length];
        SecureRandom secureRandom = new SecureRandom();
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

}
