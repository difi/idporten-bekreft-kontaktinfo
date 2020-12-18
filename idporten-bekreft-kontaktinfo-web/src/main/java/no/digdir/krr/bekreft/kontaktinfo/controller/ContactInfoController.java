package no.digdir.krr.bekreft.kontaktinfo.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.krr.bekreft.kontaktinfo.domain.ContactInfoResource;
import no.digdir.krr.bekreft.kontaktinfo.domain.PersonResource;
import no.digdir.krr.bekreft.kontaktinfo.logging.event.EventService;
import no.digdir.krr.bekreft.kontaktinfo.service.ClientService;
import no.digdir.krr.bekreft.kontaktinfo.service.KontaktinfoCache;
import no.idporten.sdk.oidcserver.OpenIDConnectIntegration;
import no.idporten.sdk.oidcserver.protocol.Authorization;
import no.idporten.sdk.oidcserver.protocol.AuthorizationResponse;
import no.idporten.sdk.oidcserver.protocol.PushedAuthorizationRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import static no.digdir.krr.bekreft.kontaktinfo.rest.PAREndpoint.SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
public class ContactInfoController {

    public static final String DIGITALCONTACTREGISTER_EMAIL = "epostadresse";
    public static final String DIGITALCONTACTREGISTER_MOBILE = "mobiltelefonnummer";
    public static final String DIGITALCONTACTREGISTER_PID = "pid";
    public static final String DIGITALCONTACTREGISTER_POSTBOXOPERATOR = "postboksoperator";
    public static final String DIGITALCONTACTREGISTER_RESERVED = "reservasjon";
    public static final String DIGITALCONTACTREGISTER_STATUS = "status";
    static final String INGEN_ENDRING = "nop";
    private static final String APP_CONTEXT_PATH = "/idporten-bekreft-kontaktinfo";
    static final String AUTOSUBMIT_PAGE = APP_CONTEXT_PATH + "/api/autosubmit";
    static final String CREATE_PAGE = APP_CONTEXT_PATH + "/create";
    static final String CREATE_EMAIL_PAGE = APP_CONTEXT_PATH + "/createEmail";
    static final String CREATE_MOBILE_PAGE = APP_CONTEXT_PATH + "/createMobile";
    static final String CONFIRM_PAGE = APP_CONTEXT_PATH;
    private static final String COMPLETE_ENDPOINT = "/completeAuthorize";
    public static final String COMPLETE_AUTHORIZE_PAGE = APP_CONTEXT_PATH + "/api" + COMPLETE_ENDPOINT;
    private static final String AMR = "kontaktinfo";
    private static final String LOCALE_PARAM = "lng";
    private static final String EMAIL_PARAM = "email";
    private static final String MOBILE_PARAM = "mobile";
    private static final String CODE_PARAM = "code";
    private static final String FRONTEND_GOTO_PARAM = "goto";
    private static final String IDPORTEN_GOTO_PARAM = "gotoParam";

    @Value("${featureswitch.bekreft_kontaktinfo_enabled}")
    private Boolean bekreftKontaktinfoEnabled;

    private final ClientService clientService;
    private final KontaktinfoCache kontaktinfoCache;
    private final OpenIDConnectIntegration openIDConnectSdk;
    private final EventService eventService;

    static ResponseEntity<Void> redirect(String location) {
        return ResponseEntity
                .status(HttpStatus.FOUND.value())
                .location(URI.create(location))
                .build();
    }

    static ResponseEntity<Void> redirectToFrontEnd(String frontEndRoute, ContactInfoResource contactInfoResource, String gotoParam, String locale) {
        UriComponents redirectUri;
        String mobileNumber = contactInfoResource.getMobile();

        try {
            if (mobileNumber != null) {
                mobileNumber = URLEncoder.encode(mobileNumber, StandardCharsets.UTF_8.toString());
            }

            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(frontEndRoute))
                    .queryParam(LOCALE_PARAM, locale)  // i18n uses 'lng' param to set language automagic
                    .queryParam(FRONTEND_GOTO_PARAM, URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam(CODE_PARAM, contactInfoResource.getCode())
                    .queryParam(EMAIL_PARAM, contactInfoResource.getEmail())
                    .queryParam(MOBILE_PARAM, mobileNumber)
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Could not build URI for Front-End", e);
        }
        return redirect(redirectUri.toUriString());
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(
            @PathVariable("fnr") String fnr,
            @RequestParam(value = "goto") String gotoParam,
            @RequestParam(value = "locale") String locale,
            HttpServletRequest request) {

        if (!bekreftKontaktinfoEnabled) {
            PushedAuthorizationRequest authorizationRequest = (PushedAuthorizationRequest) request.getSession()
                    .getAttribute(SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST);
            AuthorizationResponse authorizationResponse =
                    openIDConnectSdk.errorResponse(authorizationRequest, "disabled", "IBK is disabled");
            return redirectToDestination(AUTOSUBMIT_PAGE, authorizationResponse.toQueryRedirectUri().toString());
        }

        return confirmUserInfo(fnr, gotoParam, locale, request);
    }

    @PostMapping(COMPLETE_ENDPOINT)
    @ResponseBody
    public ResponseEntity<Void> completeAuthorize(@RequestParam String code, HttpServletRequest request) {
        PersonResource personResource = kontaktinfoCache.getPersonResource(code);

        return createAuthorizationResponse(request, personResource);
    }

    public String buildRedirectPath(PersonResource personResource) {

        if (personResource != null) {

            if (personResource.isNewUser()) {
                return CREATE_PAGE;
            }

            if (personResource.getShouldUpdateKontaktinfo()) {

                if (personResource.getEmail() == null && personResource.getMobile() == null) {
                    return CREATE_PAGE;
                }

                if (personResource.getEmail() == null) {
                    return CREATE_EMAIL_PAGE;
                }

                if (personResource.getMobile() == null) {
                    return CREATE_MOBILE_PAGE;
                }

                // user should confirm / update contact info
                return CONFIRM_PAGE;
            }
        }

        // user should be redirected back to idporten
        return INGEN_ENDRING;
    }

    public ResponseEntity<Void> redirectToDestination(String location, String gotoParam) {

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam(IDPORTEN_GOTO_PARAM, URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }
        log.debug("Redirecting: -" + redirectUri.toUriString());
        return redirect(redirectUri.toUriString());
    }

    // function for jUnit
    String getRedirectPath(String fnr) {
        PersonResource personResource = clientService.getKontaktinfo(fnr);
        return buildRedirectPath(personResource);
    }

    public ResponseEntity<Void> confirmUserInfo(String fnr, String gotoParam, String locale, HttpServletRequest request) {
        PersonResource personResource = clientService.getKontaktinfo(fnr);

        if (personResource == null) {
            //TODO: handle no person resource returning in idporten
            return redirectToDestination(AUTOSUBMIT_PAGE, gotoParam);
        }

        String redirectPath = buildRedirectPath(personResource);

        if (INGEN_ENDRING.equals(redirectPath)) {
            eventService.logUserContinueToDestination(fnr);
            return createAuthorizationResponse(request, personResource);
        } else {
            eventService.logUserNeedsToConfirm(fnr);

            // lagre ressurs for mulig oppdatering av Front-End
            personResource.setCode(kontaktinfoCache.putPersonResource(personResource));

            return redirectToFrontEnd(
                    redirectPath,
                    ContactInfoResource.fromPersonResource(personResource),
                    gotoParam,
                    locale);
        }
    }

    ResponseEntity<Void> createAuthorizationResponse(HttpServletRequest request, PersonResource personResource) {
        PushedAuthorizationRequest authorizationRequest = (PushedAuthorizationRequest) request.getSession().getAttribute(SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST);
        String postboxOperator = personResource.getDigitalPost() == null
                ? null
                : personResource.getDigitalPost().getPostkasseleverandoernavn();
        Authorization authorization = Authorization.builder()
                .pid(personResource.getPersonIdentifikator())
                .acr(authorizationRequest.getResolvedAcrValue())
                .amr(AMR)
                .attribute(DIGITALCONTACTREGISTER_EMAIL, personResource.getEmail())
                .attribute(DIGITALCONTACTREGISTER_MOBILE, personResource.getMobile())
                .attribute(DIGITALCONTACTREGISTER_POSTBOXOPERATOR, postboxOperator)
                .attribute(DIGITALCONTACTREGISTER_RESERVED, String.valueOf(personResource.getReserved()))
                .attribute(DIGITALCONTACTREGISTER_STATUS, personResource.getStatus())
                .build();
        AuthorizationResponse authorizationResponse = openIDConnectSdk.authorize(authorizationRequest, authorization);

        return redirectToDestination(AUTOSUBMIT_PAGE, authorizationResponse.toQueryRedirectUri().toString());
    }
}
