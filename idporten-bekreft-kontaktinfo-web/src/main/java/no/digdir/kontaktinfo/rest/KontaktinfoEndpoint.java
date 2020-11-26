package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
import no.digdir.kontaktinfo.rest.exception.ResourceNotFoundException;
import no.digdir.kontaktinfo.rest.exception.ServiceUnavailableException;
import no.digdir.kontaktinfo.rest.exception.UnauthorizedException;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;


import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class KontaktinfoEndpoint {
    public static List<MediaType> ACCEPT_MEDIA_TYPES = Collections.singletonList(MediaType.APPLICATION_JSON);
    private final ClientService clientService;
    private final KontaktinfoCache kontaktinfoCache;

    @PostMapping("/kontaktinfo")
    public ResponseEntity<ContactInfoResource> updateKontaktinfo(@RequestBody ContactInfoResource updatedResource) {
        PersonResource personResource = kontaktinfoCache.getPersonResource(updatedResource.getCode());

        if(personResource == null){
            throw new UnauthorizedException("UUID is not valid");
        }

        clientService.updateKontaktinfo(personResource.getPersonIdentifikator(), updatedResource.getEmail(), updatedResource.getMobile());
        ContactInfoResource responseResource = prepareAndCacheResponseResource(updatedResource,personResource);
        return new ResponseEntity<ContactInfoResource>(responseResource, HttpStatus.OK);
    }
    /*
    @GetMapping("/kontaktinfo")
    public ResponseEntity<ContactInfoResource> getKontaktinfo(){
        PersonResource personResource = clientService.getKontaktinfo("24079424184");
        personResource.setCode(kontaktinfoCache.putPersonResource(personResource));
        return new ResponseEntity<ContactInfoResource>(ContactInfoResource.fromPersonResource(personResource), HttpStatus.OK);
    }
     */

    private ContactInfoResource prepareAndCacheResponseResource(ContactInfoResource updatedResource, PersonResource personResource){
        personResource.setEmail(updatedResource.getEmail());
        personResource.setMobile(updatedResource.getMobile());
        String code = kontaktinfoCache.putPersonResource(personResource);
        personResource.setCode(code);
        return ContactInfoResource.fromPersonResource(personResource);
    }

}
