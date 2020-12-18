package no.digdir.krr.bekreft.kontaktinfo.rest;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import no.digdir.krr.bekreft.kontaktinfo.domain.ContactInfoResource;
import no.digdir.krr.bekreft.kontaktinfo.domain.PersonResource;
import no.digdir.krr.bekreft.kontaktinfo.rest.exception.UnauthorizedException;
import no.digdir.krr.bekreft.kontaktinfo.service.ClientService;
import no.digdir.krr.bekreft.kontaktinfo.service.KontaktinfoCache;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class KontaktinfoEndpoint {
    private final ClientService clientService;
    private final KontaktinfoCache kontaktinfoCache;

    @PostMapping("/kontaktinfo")
    public ResponseEntity<ContactInfoResource> updateKontaktinfo(@RequestBody ContactInfoResource updatedResource) {
        PersonResource personResource = kontaktinfoCache.getPersonResource(updatedResource.getCode());

        if (personResource == null) {
            throw new UnauthorizedException("Could not retrieve resource.");
        }

        clientService.updateKontaktinfo(personResource.getPersonIdentifikator(), updatedResource.getEmail(), updatedResource.getMobile());
        ContactInfoResource responseResource = updateAndCacheResponseResource(updatedResource, personResource);
        return new ResponseEntity<>(responseResource, HttpStatus.OK);
    }

    private ContactInfoResource updateAndCacheResponseResource(ContactInfoResource updatedResource, PersonResource personResource) {
        personResource.setEmail(updatedResource.getEmail());
        personResource.setMobile(updatedResource.getMobile());
        String code = kontaktinfoCache.putPersonResource(personResource);
        personResource.setCode(code);
        return ContactInfoResource.fromPersonResource(personResource);
    }

}
