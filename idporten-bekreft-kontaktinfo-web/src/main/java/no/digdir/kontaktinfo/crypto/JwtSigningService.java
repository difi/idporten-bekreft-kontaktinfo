package no.digdir.kontaktinfo.crypto;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.crypto.factories.DefaultJWSVerifierFactory;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.PublicKey;
import java.text.ParseException;

@Service
public class JwtSigningService {

    private KeyProvider keyProvider;

    @Autowired
    public JwtSigningService(KeyProvider keyProvider) {
        this.keyProvider = keyProvider;
    }

    public String signJwt(JWTClaimsSet claims) {
        try {
            JWSSigner signer = new RSASSASigner(keyProvider.privateKey());
            JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256)
                    .build();
            SignedJWT signedJWT = new SignedJWT(header, claims);
            signedJWT.sign(signer);
            return signedJWT.serialize();
        } catch (JOSEException e) {
            throw new RuntimeException("Failed to create signature", e);
        }
    }

}
