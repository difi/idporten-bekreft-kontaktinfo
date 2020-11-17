package no.digdir.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.kontaktinfo.domain.PersonResource;
import no.digdir.kontaktinfo.domain.ContactInfoResource;
import no.digdir.kontaktinfo.service.ClientService;
import no.digdir.kontaktinfo.service.KontaktinfoCache;
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
    public ResponseEntity<ContactInfoResource> updateKontaktinfo(@RequestBody ContactInfoResource resource) {

        PersonResource personResource = kontaktinfoCache.getPersonResource(resource.getUuid());

        if (personResource == null){
            return new ResponseEntity<>(null, HttpStatus.FORBIDDEN);
        }

        try {
            clientService.updateKontaktinfo(personResource.getPersonIdentifikator(), resource.getEmail(), resource.getMobile());
        } catch (Exception e){
            log.error("failed to update user");
            resource.setError("error message");
            resource = ContactInfoResource.fromPersonResource(clientService.getKontaktinfo(personResource.getPersonIdentifikator()));
        }

        PersonResource newPersonResource = PersonResource.builder().
                personIdentifikator(personResource.getPersonIdentifikator()).
                email(resource.getEmail()).
                mobile(resource.getMobile()).
                build();

        String code = kontaktinfoCache.putPersonResource(newPersonResource);
        resource.setCode(code);

        return new ResponseEntity<ContactInfoResource>(resource, HttpStatus.OK);
    }
}
