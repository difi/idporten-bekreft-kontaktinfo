package no.digdir.krr.bekreft.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController;
import no.idporten.sdk.oidcserver.OAuth2Exception;
import no.idporten.sdk.oidcserver.OpenIDConnectIntegration;
import no.idporten.sdk.oidcserver.protocol.AuthorizationRequest;
import no.idporten.sdk.oidcserver.protocol.ErrorResponse;
import no.idporten.sdk.oidcserver.protocol.OpenIDProviderMetadataResponse;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationRequest;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationResponse;
import no.idporten.sdk.oidcserver.protocol.TokenRequest;
import no.idporten.sdk.oidcserver.protocol.TokenResponse;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import static no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController.COMPLETE_AUTHORIZE_PAGE;
import static no.digdir.krr.bekreft.kontaktinfo.controller.ContactInfoController.DIGITALCONTACTREGISTER_PID;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class PAREndpoint {
    public static final String SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST = PushedAuthorizationRequest.class.getName();
    private final ContactInfoController contactInfoController;
    private final OpenIDConnectIntegration openIDConnectSdk;

    @GetMapping(value = {"/jwk", "/jwks", "/.well-known/jwks.json"}, produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins = "*")
    public ResponseEntity<String> jwks() {
        return ResponseEntity.ok(openIDConnectSdk.getPublicJWKSet().toString());
    }

    @GetMapping(value = "/.well-known/openid-configuration", produces = MediaType.APPLICATION_JSON_VALUE)
    @CrossOrigin(origins = "*")
    public ResponseEntity<OpenIDProviderMetadataResponse> openidConfiguration() {
        return ResponseEntity.ok(openIDConnectSdk.getOpenIDProviderMetadata());
    }

    @PostMapping(
            value = "/par",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<PushedAuthorizationResponse> par(HttpServletRequest request) {
        return ResponseEntity.ok(openIDConnectSdk.process(new PushedAuthorizationRequest(request)));
    }

    @GetMapping("/authorize")
    public Object authorize(HttpServletRequest request) {
        request.getSession().invalidate(); // FIXME: trengs denne?
        try {
            PushedAuthorizationRequest pushedAuthorizationRequest =
                    openIDConnectSdk.process(new AuthorizationRequest(request));
            request.getSession(true).setAttribute(SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST, pushedAuthorizationRequest);

            return contactInfoController.confirm(
                    pushedAuthorizationRequest.getParameter(DIGITALCONTACTREGISTER_PID),
                    COMPLETE_AUTHORIZE_PAGE,
                    pushedAuthorizationRequest.getResolvedUiLocale(),
                    request);
        } catch (OAuth2Exception e) {
            log.warn("Failed to process authorization request", e);
            return "error";
        }
    }

    @PostMapping(
            value = "/token",
            produces = MediaType.APPLICATION_JSON_VALUE,
            consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
    public ResponseEntity<TokenResponse> token(HttpServletRequest request) {
        return ResponseEntity.ok(openIDConnectSdk.process(new TokenRequest(request)));
    }

    @ExceptionHandler(OAuth2Exception.class)
    public ResponseEntity<ErrorResponse> handleError(HttpSession session, OAuth2Exception exception) {
        session.invalidate();
        log.warn(exception.getMessage(), exception);
        return ResponseEntity.status(exception.getHttpStatusCode()).body(exception.errorResponse());
    }
}
