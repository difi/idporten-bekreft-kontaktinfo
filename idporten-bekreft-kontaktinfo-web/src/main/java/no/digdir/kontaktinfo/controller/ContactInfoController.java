package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.UnsupportedEncodingException;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Controller
@Slf4j
@RequestMapping("/api")
public class ContactInfoController {

    ClientService clientService;

    @Autowired
    public ContactInfoController(ClientService clientService) {
        this.clientService = clientService;
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam, @RequestParam(value = "locale") String locale) {

        PersonResource personResource = clientService.getKontaktinfo(fnr);
        
        // check if user should be redirected to front-end application
        if(buildRedirectPath(personResource) != null){

            //TODO: save fnr in cache
            //TODO: save uuid (key) to contactInfoResource

            return redirectWithParam(
                    buildRedirectPath(personResource),
                    ContactInfoResource.fromPersonResource(personResource),
                    gotoParam,
                    locale);
        } else {
            // nothing to do, return to idporten
            return redirectWithGotoParam("/idporten-bekreft-kontaktinfo/api/autosubmit", gotoParam);
        }
    }

    public String buildRedirectPath(PersonResource personResource) {

        if(personResource == null){
            return null; // abort
        }

        if (personResource.isNewUser()) {
            return "/idporten-bekreft-kontaktinfo/create";
        }

        if (personResource.getShouldUpdateKontaktinfo()) {

            if(personResource.getEmail() == null && personResource.getMobile() == null){
                return "/idporten-bekreft-kontaktinfo/create";
            }

            if (personResource.getEmail() == null) {
                return "/idporten-bekreft-kontaktinfo/createEmail";
            }

            if (personResource.getMobile() == null) {
                return "/idporten-bekreft-kontaktinfo/createMobile";
            }

            // user should confirm / update contact info
            return "/idporten-bekreft-kontaktinfo";
        }

        // user should be redirected back to idporten
        return null;
    }

    public ResponseEntity<Void> redirect(String location){
        return ResponseEntity
                .status(302)
                .location(URI.create(location))
                .build();
    }

    public ResponseEntity<Void> redirectWithParam(String location, ContactInfoResource contactInfoResource, String gotoParam, String locale){
        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam("lng", locale)  // i18n uses 'lng' param to set language automagic
                    .queryParam("goto", URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam("uuid", contactInfoResource.getUuid())
                    .queryParam("email", contactInfoResource.getEmail())
                    .queryParam("mobile", contactInfoResource.getMobile())
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }
        log.error("Redirecting: -" + redirectUri.toUriString());
        return redirect(redirectUri.toUriString());
    }

    public ResponseEntity<Void> redirectWithGotoParam(String location, String gotoParam){

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam("gotoParam", URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .build();
        } catch (URISyntaxException | UnsupportedEncodingException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }
        log.error("Redirecting: -" + redirectUri.toUriString());
        return redirect(redirectUri.toUriString());
    }

    // function for jUnit
    public String getRedirectPath(String fnr){
        PersonResource personResource = clientService.getKontaktinfo(fnr);
        return buildRedirectPath(personResource);
    }
}
