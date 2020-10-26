package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;
import java.io.UnsupportedEncodingException;
import javax.servlet.http.HttpServletRequest;
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

    @GetMapping("/autosubmit")
    @ResponseBody
    public void receiveResponse(HttpServletRequest request,
                                @RequestParam String gotoParam,
                                HttpServletResponse response) throws URISyntaxException, IOException {
        String url = gotoParam;
        renderHelpingPage(response, url);
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam, @RequestParam(value = "locale") String locale) {

        //TODO: validere request fra idporten?
        log.error("ContactInfoController confirm " + fnr + " -" + gotoParam);
        PersonResource personResource = getPersonResourceForFnr(fnr);

        if(getRedirectPath(personResource) != null){
            return redirectWithParam(getRedirectPath(personResource), fnr, gotoParam, locale);
        }else{
            return redirectWithGotoParam("/idporten-bekreft-kontaktinfo/api/autosubmit", gotoParam);
        }

    }

    public String getRedirectPath(PersonResource personResource) {

        if (personResource == null || personResource.isNewUser()) {
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

    public ResponseEntity<Void> redirectWithParam(String location, String fnr, String gotoParam, String locale){

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))

                    // i18n uses 'lng' param to set locale automagic
                    .queryParam("lng", locale)
                    .queryParam("goto", URLEncoder.encode(gotoParam, StandardCharsets.UTF_8.toString()))
                    .queryParam("fnr", fnr)
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

    public PersonResource getPersonResourceForFnr(String fnr){

        PersonResource personResource;

        try {
            personResource = clientService.getKontaktinfo(fnr);
        } catch (Exception e) {

            // TODO: is this because user is not created in KRR, or because connection to KRR failed
            log.error("Failed to retrieve digital contact info for user", e);
            personResource = null;
        }

        return personResource;
    }

    private void renderHelpingPage(HttpServletResponse response, String url) throws IOException {
        StringBuilder result = new StringBuilder();
        result.append(top(url));
        result.append(footer());
        response.setContentType(getContentType());
        response.getWriter().append(result);
    }
    private String top(String url) {
        return "<html>" +
                "<head><title>Bekreft Kontaktinformasjon</title></head>" +
                "<body onload=\"javascript:document.forms[0].submit()\">" +
                "<form target=\"_parent\" method=\"post\" action=\"" + url + "\">";
    }
    private String footer() {
        return "<noscript><input type=\"submit\" value=\"Click to redirect\"></noscript>" +
                "</form>" +
                "</body>" +
                "</html>";
    }
    private String getContentType() {
        return "text/html";
    }
}
