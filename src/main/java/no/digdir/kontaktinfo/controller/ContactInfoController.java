package no.digdir.kontaktinfo.controller;

import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

import java.net.URI;

@Controller
@RequestMapping("/api")
public class ContactInfoController {

    ClientService clientService;

    @Autowired
    public ContactInfoController(ClientService clientService) {
        this.clientService = clientService;
    }

    /**
     * Check if user needs to update contact info with information from FNR and KRR
     *
     * @param fnr
     * @return ResponseEntity
     */
    @GetMapping("/user/{fnr}/confirm")
    public Object confirm(@PathVariable("fnr") String fnr) {

        //TODO: Her et sted må vi nok validere requesten fra idporten også

        // get person from fnr
        PersonResource personResource = clientService.getPersonForFnr(fnr);
        // TODO: handle invalid fnr - gets nullpoint exception

        // check if user needs to update contact info
        // should return True | False
        if(personResource.getShouldUpdateKontaktinfo()){

            // redirect to react-frontpage
            // TODO: get dynamic url to react path?
            return redirect("/idporten-bekreft-kontaktinfo");
        }

        // no update needed
        // redirect to idporten
        // TODO: get url to idporten - denne url'en ligger i requesten
        return redirect("http://eid.difi.no/nb/id-porten");
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
}
