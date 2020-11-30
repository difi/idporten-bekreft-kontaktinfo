package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
@Slf4j
@RequestMapping("/api")
public class ContactInfoController {

    private final ClientService clientService;
    private final KontaktinfoCache kontaktinfoCache;

    private final static String LOCALE_PARAM = "lng";
    private final static String EMAIL_PARAM = "email";
    private final static String MOBILE_PARAM = "mobile";
    private final static String CODE_PARAM = "code";

    private final static String FRONTEND_GOTO_PARAM = "goto";
    private final static String IDPORTEN_GOTO_PARAM = "gotoParam";

    public final static String AUTOSUBMIT_PAGE = "/idporten-bekreft-kontaktinfo/api/autosubmit";
    public final static String CREATE_PAGE = "/idporten-bekreft-kontaktinfo/create";
    public final static String CREATE_EMAIL_PAGE = "/idporten-bekreft-kontaktinfo/createEmail";
    public final static String CREATE_MOBILE_PAGE = "/idporten-bekreft-kontaktinfo/createMobile";
    public final static String CONFIRM_PAGE = "/idporten-bekreft-kontaktinfo";

    @Value("${featureswitch.bekreft_kontaktinfo_enabled}")
    private Boolean bekreftKontaktinfoEnabled;

    public ContactInfoController(ClientService clientService,KontaktinfoCache kontaktinfoCache) {
        this.clientService = clientService;
        this.kontaktinfoCache = kontaktinfoCache;
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam, @RequestParam(value = "locale") String locale) {

        if(!bekreftKontaktinfoEnabled){
            return redirectToDestination(AUTOSUBMIT_PAGE, gotoParam);
        }

        return redirectUser(fnr, gotoParam, locale);
    }

    public String buildRedirectPath(PersonResource personResource) {

        if (personResource != null){

            if (personResource.isNewUser()) {
                return CREATE_PAGE;
            }

            if (personResource.getShouldUpdateKontaktinfo()) {

                if(personResource.getEmail() == null && personResource.getMobile() == null){
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
        return null;
    }

    public static ResponseEntity<Void> redirect(String location){
        return ResponseEntity
                .status(302)
                .location(URI.create(location))
                .build();
    }

    public ResponseEntity<Void> redirectToFrontEnd(String location, ContactInfoResource contactInfoResource, String gotoParam, String locale){
        UriComponents redirectUri;
        String mobileNumber = contactInfoResource.getMobile();

        try {
            if(mobileNumber != null) {
                mobileNumber = URLEncoder.encode(mobileNumber, StandardCharsets.UTF_8.toString());
            }

            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam(LOCALE_PARAM, locale)  // i18n uses 'lng' param to set language automagic
                    .queryParam(FRONTEND_GOTO_PARAM, URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam(CODE_PARAM, contactInfoResource.getCode())
                    .queryParam(EMAIL_PARAM, contactInfoResource.getEmail())
                    .queryParam(MOBILE_PARAM, mobileNumber)
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }
        log.debug("Redirecting: -" + redirectUri.toUriString());
        return redirect(redirectUri.toUriString());
    }

    public ResponseEntity<Void> redirectToDestination(String location, String gotoParam){

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
    public String getRedirectPath(String fnr){
        PersonResource personResource = clientService.getKontaktinfo(fnr);
        return buildRedirectPath(personResource);
    }


    private ResponseEntity<Void> redirectUser(String fnr, String gotoParam, String locale){
        PersonResource personResource = clientService.getKontaktinfo(fnr);

        if(personResource == null){
            //TODO: handle no person resource returning in idporten
            return redirectToDestination(AUTOSUBMIT_PAGE, gotoParam);
        }

        personResource.setCode(kontaktinfoCache.putPersonResource(personResource));

        if(buildRedirectPath(personResource) != null){
            return redirectToFrontEnd(
                    buildRedirectPath(personResource),
                    ContactInfoResource.fromPersonResource(personResource),
                    gotoParam,
                    locale);
        } else {
            String gotoParamWithCode = new StringBuffer(gotoParam)
                    .append("&")
                    .append(CODE_PARAM)
                    .append("=")
                    .append(personResource.getCode())
                    .toString();
            return redirectToDestination(AUTOSUBMIT_PAGE, gotoParamWithCode);
        }
    }
}
