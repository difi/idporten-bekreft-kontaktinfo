package no.digdir.kontaktinfo.controller;

import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
     * Route controller, redirect user to correct form.
     *
     * @param fnr
     * @param gotoParam
     * @return
     */
    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam) {

        //TODO: validere request fra idporten?

        PersonResource personResource = _getPersonResourceForFnr(fnr);

       // check if user exist, or is missing all contact info
        if (personResource == null || personResource.getEmail() == null && personResource.getMobile() == null) {

            // redirect user to 'create' form (optional)
            return _redirectWithParam("/idporten-bekreft-kontaktinfo/create", fnr, gotoParam);
        }

        // check if users contact info needs to be updated
        if (personResource.getShouldUpdateKontaktinfo()) {

            // if user is missing an email address
            if (personResource.getEmail() == null) {
                
                // redirect user to 'create email' form (optional)
                // show a tip note about why user should provide an email address
                return _redirectWithParam("/idporten-bekreft-kontaktinfo/createEmail", fnr, gotoParam);
            }

           // if user is missing an mobile phone number
            if (personResource.getMobile() == null) {

                // redirect user to 'create phohen' form (optional)
                // show a tip note about why user should provide an mobile phone number
                return _redirectWithParam("/idporten-bekreft-kontaktinfo/createMobile", fnr, gotoParam);
            }

            // user has provided an email address and a mobile phone number
            // redirect user to confirm their contact info
            return _redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // user does not have to update their contact info
        // redirect user back to idporten
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
