package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
import no.digdir.kontaktinfo.domain.PARRequest;
import no.digdir.kontaktinfo.domain.PARResponse;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
import no.digdir.kontaktinfo.service.PARService;
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
    private final PARService parService;
    private final KontaktinfoCache kontaktinfoCache;

    @Value("${par.cache.ttl-in-s:120}")
    private int ttl;

    public ContactInfoController(ClientService clientService, PARService parService, KontaktinfoCache kontaktinfoCache) {
        this.clientService = clientService;
        this.parService = parService;
        this.kontaktinfoCache = kontaktinfoCache;
    }

    @PostMapping("/par")
    @ResponseBody
    public ResponseEntity<PARResponse> par(@RequestBody PARRequest parRequest) {
        String requestUri = parService.generateRequestUri();
        kontaktinfoCache.putParRequest(requestUri, parRequest);
        kontaktinfoCache.putPid(requestUri, parRequest.getPid());
        PARResponse response = new PARResponse(requestUri, ttl);
        return ResponseEntity.ok().body(response);
    }

    @GetMapping("/authorize")
    public Object authorize(@PathVariable String requestUri) {
        String uuid = requestUri;
        PARRequest parRequest = kontaktinfoCache.getParRequest(uuid);
        return confirm(kontaktinfoCache.getPid(uuid), parRequest.getGotoParam(), parRequest.getLocale());
    }

    @PostMapping("/token")
    public Object token(@RequestBody String code) {
        PersonResource kontaktinfo = kontaktinfoCache.getPersonResource(code);
        String jwt = parService.makeJwt(kontaktinfo.getPersonIdentifikator(), kontaktinfo.getEmail(), kontaktinfo.getMobile());
        kontaktinfoCache.removePersonResource(code);
        return jwt;
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam, @RequestParam(value = "locale") String locale) {
        PersonResource personResource = clientService.getKontaktinfo(fnr);
        personResource.setCode(kontaktinfoCache.putPersonResource(personResource));

        // check if user should be redirected to front-end application
        if(buildRedirectPath(personResource) != null){
            return redirectWithParam(
                    buildRedirectPath(personResource),
                    ContactInfoResource.fromPersonResource(personResource),
                    gotoParam,
                    locale);
        } else {
            return redirectWithGotoParam("/idporten-bekreft-kontaktinfo/api/autosubmit", gotoParam, personResource.getCode());
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

    public ResponseEntity<Void> redirectWithGotoParam(String location, String gotoParam, String code){

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam("gotoParam", URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam("code", code)
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
