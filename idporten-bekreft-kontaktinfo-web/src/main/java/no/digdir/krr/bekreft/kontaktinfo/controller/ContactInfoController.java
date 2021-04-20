package no.digdir.krr.bekreft.kontaktinfo.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.krr.bekreft.kontaktinfo.config.StringConstants;
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
import static no.digdir.krr.bekreft.kontaktinfo.api.PAREndpoint.SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST;

@Controller
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api")
public class ContactInfoController {

    @Value("${featureswitch.bekreft_kontaktinfo_enabled}")
    private Boolean bekreftKontaktinfoEnabled;

    private final ClientService clientService;
    private final KontaktinfoCache kontaktinfoCache;
    private final OpenIDConnectIntegration openIDConnectSdk;
    private final EventService eventService;

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(
            @PathVariable("fnr") String fnr,
            @RequestParam(value = "goto") String gotoParam,
            @RequestParam(value = "locale") String locale,
            HttpServletRequest request) {

        eventService.logUserHasArrived(fnr);

        if (!bekreftKontaktinfoEnabled) {
            eventService.logUserContinueToDestination(fnr);
            return redirectToDestination(
                    StringConstants.AUTOSUBMIT_PAGE,
                    buildErrorResponse(request, "IBK is disabled")
            );
        }

        PersonResource personResource = clientService.getKontaktinfo(fnr);

        if (personResource == null) {
            return redirectToDestination(
                    StringConstants.AUTOSUBMIT_PAGE,
                    buildErrorResponse(request, "Contact information not available")
            );
        }

        if (personResource.shouldUserConfirmContactInfo()){
            eventService.logUserNeedsToConfirm(fnr);
            personResource.setCode(kontaktinfoCache.putPersonResource(personResource));
            return redirectToFrontEnd(
                    personResource.getNextAction(),
                    ContactInfoResource.fromPersonResource(personResource),
                    gotoParam,
                    locale);
        }

        eventService.logUserContinueToDestination(fnr);
        return redirectToDestination(
                StringConstants.AUTOSUBMIT_PAGE,
                createAuthorizationResponse(request, personResource)
        );
    }

    static ResponseEntity<Void> redirectToFrontEnd(String frontEndRoute, ContactInfoResource contactInfoResource, String gotoParam, String locale) {
        UriComponents redirectUri;

        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(frontEndRoute))
                    .queryParam(StringConstants.LOCALE_PARAM, locale)  // i18n uses 'lng' param to set language automagic
                    .queryParam(StringConstants.FRONTEND_GOTO_PARAM, URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam(StringConstants.CODE_PARAM, contactInfoResource.getCode())
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Could not build URI for Front-End", e);
        }

        return redirect(redirectUri.toUriString());
    }

    public ResponseEntity<Void> redirectToDestination(String location, String gotoParam) {

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam(StringConstants.IDPORTEN_GOTO_PARAM, URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }
        log.debug("Redirecting: -" + redirectUri.toUriString());
        return redirect(redirectUri.toUriString());
    }

    @PostMapping(StringConstants.COMPLETE_ENDPOINT)
    @ResponseBody
    public ResponseEntity<Void> completeAuthorize(@RequestParam String code, HttpServletRequest request) {
        PersonResource personResource = kontaktinfoCache.getPersonResource(code);
        return redirectToDestination(
                StringConstants.AUTOSUBMIT_PAGE,
                createAuthorizationResponse(request, personResource)
        );
    }

    String createAuthorizationResponse(HttpServletRequest request, PersonResource personResource) {
        PushedAuthorizationRequest authorizationRequest = (PushedAuthorizationRequest) request.getSession().getAttribute(SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST);
        String personIdentifikator = personResource == null ? null : personResource.getPersonIdentifikator();
        String email =  personResource == null ? null : personResource.getEmail();
        String mobile = personResource == null ? null : personResource.getMobile();
        String postboxOperator = personResource == null ? null :
                personResource.getDigitalPost() == null
                ? null
                : personResource.getDigitalPost().getPostkasseleverandoernavn();
        String reserved = personResource == null ? null : String.valueOf(personResource.getReserved());
        String status = personResource == null ? null : personResource.getStatus();

        Authorization authorization = Authorization.builder()
                .pid(personIdentifikator)
                .acr(authorizationRequest.getResolvedAcrValue())
                .amr(StringConstants.AMR)
                .attribute(StringConstants.DIGITALCONTACTREGISTER_EMAIL, email)
                .attribute(StringConstants.DIGITALCONTACTREGISTER_MOBILE, mobile)
                .attribute(StringConstants.DIGITALCONTACTREGISTER_POSTBOXOPERATOR, postboxOperator)
                .attribute(StringConstants.DIGITALCONTACTREGISTER_RESERVED, reserved)
                .attribute(StringConstants.DIGITALCONTACTREGISTER_STATUS, status)
                .build();
        AuthorizationResponse authorizationResponse = openIDConnectSdk.authorize(authorizationRequest, authorization);

        return authorizationResponse.toQueryRedirectUri().toString();
    }

    private String buildErrorResponse(HttpServletRequest request, String message) {
        PushedAuthorizationRequest authorizationRequest = (PushedAuthorizationRequest) request.getSession()
                .getAttribute(SESSION_ATTRIBUTE_AUTHORIZATION_REQUEST);

        AuthorizationResponse authorizationResponse =
                openIDConnectSdk.errorResponse(authorizationRequest, "unavailable", message);

        return authorizationResponse.toQueryRedirectUri().toString();
    }

    static ResponseEntity<Void> redirect(String location) {
        return ResponseEntity
                .status(HttpStatus.FOUND.value())
                .location(URI.create(location))
                .build();
    }

}
