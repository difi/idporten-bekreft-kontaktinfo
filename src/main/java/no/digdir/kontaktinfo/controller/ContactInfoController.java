package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

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

    /**
     * Route controller, send user to correct form if contact info
     * needs to be updated
     *
     * @param fnr
     * @param gotoParam
     * @return
     */
    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam) {

        //TODO: Her et sted må vi nok validere requesten fra idporten også
        PersonResource personResource = _getPersonResourceForFnr(fnr);

        // check if user is registered in KRR
        if (personResource == null){

            // user could not be found in KRR
            // send user to create form (optional to update contact info)
            // TODO: redirect to update all fields page
            return _redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // check if user`s contact info is empty
        if (personResource.getEmail() == null && personResource.getMobile() == null) {

            // user is missing all contact info
            // send user to update all fields form
            // TODO: redirect user to update all fields page
            return _redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // check if users`s email is empty
        if (personResource.getEmail() == null) {

            // user is missing email
            // send user to update email form, with tip note (optional update)
            return _redirectWithParam("/idporten-bekreft-kontaktinfo/editEpost", fnr, gotoParam);
        }

        // check if user`s mobile is empty
        if (personResource.getMobile() == null) {

            // user is missing mobile
            // send user to update mobile form, with tip note (optional update)
            return _redirectWithParam("/idporten-bekreft-kontaktinfo/editMobilnr", fnr, gotoParam);
        }

        // check if contact info is "out-of-date"
        if (personResource.getShouldUpdateKontaktinfo()) {

            // user should update contact info (out-of-date)
            // send user to user info page (confirm user info)
            return _redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // all contact info is provided, and up-to-date
        // send user back to idporten. Continue.
        return _redirect(gotoParam);
    }

    /**
     * Creates redirect URI and redirect user
     *
     * @param location
     * @return ResponseEntity
     */
    private ResponseEntity<Void> _redirect(String location){
        return ResponseEntity
                .status(302)
                .location(URI.create(location))
                .build();
    }

    /**
     * Create redirect URI with param and redirect user
     *
     * @param location
     * @param gotoParam
     * @param fnr
     * @return
     */
    private ResponseEntity<Void> _redirectWithParam(String location, String fnr, String gotoParam){

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

        return _redirect(redirectUri.toUriString());
    }

    /**
     * Get person resource for fnr
     * return NULL if resource could not be found
     *
     * @param fnr
     * @return
     */
    private PersonResource _getPersonResourceForFnr(String fnr){

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
}
