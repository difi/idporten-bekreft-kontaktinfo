package no.digdir.kontaktinfo.controller;

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
@RequestMapping("/api")
public class ContactInfoController {

    ClientService clientService;

    @Autowired
    public ContactInfoController(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * ContactInfoController
     * CHeck if user needs to update contact information, and redirect to location
     *
     * @param fnr
     * @return ResponseEntity
     */
    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr, @RequestParam(value = "goto") String gotoParam) {

        //TODO: Her et sted må vi nok validere requesten fra idporten også

        PersonResource personResource = clientService.getPersonForFnr(fnr);

        // check if user is registered in KRR
        if (personResource == null){
            // user is not registered
            // TODO: redirect user to create? (optional)
            return redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // check if user`s contact info is empty
        if (personResource.getEmail() == null && personResource.getMobile() == null) {
            // user is missing all contact info
            // TODO: redirect user to update all fields? (optional)
            return redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // check if users`s email is empty
        if (personResource.getEmail() == null) {
            return redirectWithParam("/idporten-bekreft-kontaktinfo/editEpost", fnr, gotoParam);
        }

        // check if user`s mobile is empty
        if (personResource.getMobile() == null) {
            return redirectWithParam("/idporten-bekreft-kontaktinfo/editMobilnr", fnr, gotoParam);
        }

        // check if contact info is "out-of-date"
        if (personResource.getShouldUpdateKontaktinfo()) {

            //TODO: redirect user to confirmation form ?
            return redirectWithParam("/idporten-bekreft-kontaktinfo", fnr, gotoParam);
        }

        // everything checks out
        // TODO: redirect user to idporten
        return redirect("");
    }

    /**
     * Creates redirect responsEntity
     *
     * @param location
     * @return ResponseEntity
     */
    private ResponseEntity<Void> redirect(String location){
        return ResponseEntity
                .status(302)
                .location(URI.create(location))
                .build();
    }

    private ResponseEntity<Void> redirectWithParam(String location, String gotoParam, String fnr){
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
}
