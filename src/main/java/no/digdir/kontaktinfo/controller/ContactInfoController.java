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

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;

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
                                /*@RequestParam String code,
                                @RequestParam String service,
                                @RequestParam String serverid,*/
                                HttpServletResponse response) throws URISyntaxException, IOException {

/*
        HttpSession session = request.getSession();

        String url = UriComponentsBuilder.newInstance()
                .uri(new URI((String) session.getAttribute("redirectUrl")))
                .queryParam("code", code)
                .queryParam("ForceAuth", session.getAttribute("forceAuth"))
                .queryParam("gx_charset", request.getSession().getAttribute("gx_charset"))
                .queryParam("locale", request.getSession().getAttribute("locale"))
                .queryParam("goto", request.getSession().getAttribute("goto"))
                .queryParam("service", service)
                .queryParam("serverid", serverid)
                .build()
                .toUriString();

         */

        String url = "http://vg.no";
        renderHelpingPage(response, url);
    }

    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam) {

        //TODO: validere request fra idporten?

        PersonResource personResource = getPersonResourceForFnr(fnr);

        if(getRedirectPath(personResource) != null){
            return redirectWithParam(getRedirectPath(personResource), fnr, gotoParam);
        }

        return redirect(gotoParam);
    }

    public String getRedirectPath(PersonResource personResource) {

        if (personResource == null) {
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

    public ResponseEntity<Void> redirectWithParam(String location, String fnr, String gotoParam){

        UriComponents redirectUri;
        try {
            redirectUri = UriComponentsBuilder.newInstance()
                    .uri(new URI(location))
                    .queryParam("goto", gotoParam)
                    .queryParam("fnr", fnr)
                    .build();
        } catch (URISyntaxException e) {
            throw new RuntimeException("Couldn't build redirect-uri");
        }

        return redirect(redirectUri.toUriString());
    }

    public PersonResource getPersonResourceForFnr(String fnr){

        PersonResource personResource;
        try {
            personResource = clientService.getPersonForFnr(fnr);
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
